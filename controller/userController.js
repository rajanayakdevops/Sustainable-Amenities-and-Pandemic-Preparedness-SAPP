const User = require('../model/user_personal_info');

exports.postSaveUserInfo =  async (req,res)=>{

  const { name, phone, email, aadhaar, userid, password } = req.body;

  try {
    // Save the user data to the database
    const newUser = new User({ name, phone, email, aadhaar, userid, password });
    await newUser.save();

    return res.redirect("/");
  } catch (err) {
    console.error('Error saving user:', err);
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
    return res.status(500).json({ message: 'Internal Server Error' });
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
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract the user's riskCategory from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Redirect to /dashboard with the user's riskCategory as a query parameter
    res.status(200).redirect(`/dashboard?riskCategory=${user.riskCategory}`);

  } catch (error) {
    console.error('Error processing form submission:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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


