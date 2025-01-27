const User = require('../model/user_personal_info');
const City = require('../model/medical-center');
const nodemailer = require("nodemailer");

exports.postSaveUserInfo = async (req, res) => {
  const { name, phone, email, aadhaar, userid, password, city, state } = req.body;

  try {
    // Save the user data to the database including city and state
    const newUser = new User({
      name,
      phone,
      email,
      aadhaar,
      userid,
      password,
      city,   // Add city
      state,  // Add state
    });
    
    await newUser.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: "www.btsmemberkim@gmail.com", // Your Gmail ID
        pass: "uoat davv jpkk zcmo", // App password
      },
    });

    const mailOptions = {
      from: "www.btsmemberkim@gmail.com",
      to: email, // Send email to the user's email
      subject: "Registration Successful",
      text: `Hi ${name},\n\nYour registration was successful. Welcome aboard!\n\nThank you for signing up.`,
    };

    await transporter.sendMail(mailOptions);

    // Redirect after successful registration and email
    return res.redirect("/");
  } catch (err) {
    console.error("Error saving user or sending email:", err);
    res.status(500).redirect("/signup");
  }
};


exports.handleUserLogin = async (req, res) => {
  const { userid, password } = req.body;

  try {
    // Find user by User ID
    const user = await User.findOne({ userid });

    if (!user) {
      return res.status(400).send('User not found');
    }

    // Compare the entered password with the stored password
    if (user.password !== password) {
      return res.status(400).send('Invalid credentials');
    }

    // If passwords match, log the user in (using session or JWT)
    req.session.userId = user._id;  // Store user ID in session (example of session-based login)
    res.redirect("/profile");  // Redirect to the dashboard or another page

  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).send('Server error');
  }
}

exports.getUserProfile = (req, res) => {
  if (req.session.userId) {
    
    
    User.findById(req.session.userId)
      .then(user => {
        
        if (!user) {
          return res.redirect('/login');  
        }

        
        res.redirect("/showForm");  
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error fetching user data');
      });
  } else {
    console.log("No user in session");
    // User is not logged in
    res.redirect('/login');
  }
}

exports.handleFormRequest = async (req, res) => {
  try {
    if (!req.session.userId) {
      console.log("session not found ");
      // If no session exists, redirect to login
      return res.redirect('/login');
    }

    const userId = req.session.userId; // Retrieve the user ID from the session

    // Fetch the user's record from the database, including hidden fields
    const user = await User.findById(userId).select('+firstLogin +isFormFilled');

    if (!user) {
      
      return res.redirect('/login'); // If user not found, redirect to login
    }

    // Check if the user is eligible to fill the form
    if (user.firstLogin && !user.isFormFilled) {
      return res.render("formData"); // Render the form page
    }

    
    // Redirect to dashboard if the user doesn't need to fill the form
    res.redirect(`/dashboard?riskCategory=${user.riskCategory}`)
  } catch (error) {
    console.error('Error handling form request:', error);
    return res.status(500).json({ message: 'Internal Server ErrorRRR' });
  }
};

exports.handleRiskFormSubmission = async (req, res) => {
  try {
    // Weights for each question
    const weights = {
      question1: 3, // Symptoms in the past 7 days
      question2: 2, // High-risk age group
      question3: 2, // Underlying health conditions
      question4: 3, // Contact with a diagnosed person
      question5: 3, // Travel to a hotspot region
    };

    // Extract form data from the request body
    const formData = req.body;

    // Calculate total score
    let totalScore = 0;
    for (const question in formData) {
      if (formData[question] === "Yes") {
        totalScore += weights[question];
      }
    }

    // Categorize risk based on total score
    let riskCategory;
    if (totalScore >= 7) {
      riskCategory = 3; // High Risk
    } else if (totalScore >= 3) {
      riskCategory = 2; // Medium Risk
    } else {
      riskCategory = 1; // No Risk
    }

    // Get the user ID from the session
    const userId = req.session.userId;

    // Update the user's data in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        riskCategory: riskCategory,   // 1, 2, or 3 based on risk level
        isFormFilled: true,           // Mark the form as filled
        firstLogin: false,            // Mark first login as false
      },
      { new: true }  // Return the updated user
    );

    // Check if the user exists in the database
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Redirect to /dashboard with the user's riskCategory as a query parameter
    res.status(200).redirect(`/dashboard?riskCategory=${riskCategory}`);
  } catch (error) {
    console.error("Error processing form submission:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};





exports.updateUserDashboard = async (req, res) => {
  const { riskCategory } = req.query;

  if (!riskCategory) {
    return res.status(400).json({ error: 'Risk category is required' });
  }

  try {
   
    const userId = req.session.userId; 

    // Fetch the full user data from the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const riskCategoryNumber = parseInt(riskCategory, 10);
    console.log(riskCategoryNumber);
    // Check if the riskCategory matches the user's risk category in the database
    if (user.riskCategory !== riskCategoryNumber) {
      return res.status(400).json({ error: 'Invalid risk category for the user' });
    }

    // Render the appropriate dashboard based on the riskCategory
    switch (riskCategoryNumber) {
      case 1:
        return res.render('lowrisk', { user });
      case 2:
        return res.render('mediumRisk', { user });
      case 3:
        return res.render('highrisk', { user });
      default:
        return res.status(400).json({ error: 'Invalid risk category' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.addNearMedicalCenter = async (req, res) => {
  const { city, medicalCenter } = req.body; // Extract data from the request body

  if (!city || !medicalCenter) {
    return res.status(400).json({
      status: 400,
      message: "City and medical center are required fields.",
    });
  }

  try {
    // Check if the city exists in the database
    let existingCity = await City.findOne({ city });

    if (existingCity) {
      // City exists, add the medical center
      existingCity.medicalCenters.push(medicalCenter);
      await existingCity.save();

      return res.status(200).json({
        status: 200,
        message: "Medical center added to existing city",
        data: existingCity,
      });
    } else {
      // City doesn't exist, create a new document
      const newCity = new City({
        city,
        medicalCenters: [medicalCenter],
      });
      await newCity.save();

      return res.status(201).json({
        status: 201,
        message: "New city created and medical center added",
        data: newCity,
      });
    }
  } catch (err) {
    console.error("Error in showNearMedicalCenter function:", err.message);
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

exports.showNearMedicalCenter = async (req, res) => {
  try {
    // Fetch the userId from the session
    const userId = req.session.userId;

    if (!userId) {
      return res.status(400).json({
        status: 400,
        message: "User ID is not defined in the session.",
      });
    }

    // Fetch the user from the database using the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found.",
      });
    }

    // Extract the city from the user's data
    const city = user.city;

    if (!city) {
      return res.status(400).json({
        status: 400,
        message: "City is not defined in the user's data.",
      });
    }

    // Query the database for the city and its medical centers
    const cityData = await City.findOne({ city });

    if (!cityData) {
      return res.status(404).render('error', {
        message: `No data found for the city: ${city}`,
      });
    }

    // Extract medical center details
    const medicalCenters = cityData.medicalCenters;

    // Pass the data to the frontend via res.render
    return res.render('medicalCenters', {
      city: cityData.city, // City name
      medicalCenters: medicalCenters, // Array of medical centers
    });
  } catch (err) {
    console.error("Error fetching medical centers:", err.message);
    return res.status(500).render('error', {
      message: "Internal Server Error. Please try again later.",
    });
  }
};

exports.showRealDataAnalysic = async (req, res) => {
  try {
    // Get the userId from the session
    const userId = req.session.userId;

    // Fetch the user from the database using the session userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get the riskCategory from the user's session
    const riskCategoryNumber = user.riskCategory;

    // Render the appropriate dashboard page based on the riskCategory
    switch (riskCategoryNumber) {
      case 1:
        return res.render('low_Analysic', { user });
      case 2:
        return res.render('medium_Analysic', { user });
      case 3:
        return res.render('high_Analysic', { user });
      default:
        return res.status(400).json({ error: 'Invalid risk category' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};




