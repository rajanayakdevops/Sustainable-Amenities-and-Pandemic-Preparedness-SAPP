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
    // User is logged in, fetch user data from the database
    User.findById(req.session.userId)
      .then(user => {
        if (!user) {
          return res.redirect('/login');  // User not found, redirect to login page
        }

        // Render the profile page with user data
        res.render('profile', { user });  // 'profile' is the EJS view, and 'user' is the data passed to it
      })
      .catch(err => {
        console.error(err);
        res.status(500).send('Error fetching user data');
      });
  } else {
    // User is not logged in
    res.redirect('/login');
  }
}