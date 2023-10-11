using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace TaskTracker_Application
{
    public partial class loginForm : Form
    {
        user temp = new user();
        static PMISEntities tempEntities = new PMISEntities();
        List<user> users = tempEntities.users.ToList<user>();
        string role = "";
        public loginForm()
        {
            InitializeComponent();
        }

        public loginForm(string username, string password)
        {
            InitializeComponent();
            textUsername.Text = username;
            textPassword.Text = password;
        }

        private void loginForm_Load(object sender, EventArgs e)
        {
            tempEntities = new PMISEntities();
            users = tempEntities.users.ToList<user>();
        }

        private void buttonLogin_Click(object sender, EventArgs e)
        {
            user matchedUser = users.FirstOrDefault(user => user.username == textUsername.Text);

            if (matchedUser != null)
            {
                if (matchedUser.password == textPassword.Text)
                {
                    role = matchedUser.role;
                    login();
                    startSession();
                    return; // Exit the method after successful login
                }
                else
                {
                    MessageBox.Show("Incorrect Password");
                    return; // Exit the method when password is incorrect
                }
            }

            MessageBox.Show("Incorrect Username");
        }

        private void login()
        {
            if(role == "Employee")
            {
                loginEmployee();
            }
            else if(role == "Manager")
            {
                loginManager();
            }
            else if (role == "Admin")
            {
                loginAdmin();
            }
            else
                Application.Exit();
        }

        private void loginEmployee() 
        {
            employeeForm newForm = new employeeForm();
            newForm.Show();
            this.Hide();
        }

        private void loginManager()
        {
            managerForm newForm = new managerForm();
            newForm.Show();
            this.Hide();
        }

        private void loginAdmin()
        {
            adminForm newForm = new adminForm();
            newForm.Show();
            this.Hide();
        }

        private void linkLabelSignup_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            signupForm newForm = new signupForm();
            newForm.Show();
            this.Hide();
        }

        private void startSession()
        {
            Session.userName = textUsername.Text;
            Session.userID = users.FirstOrDefault(user => user.username == textUsername.Text).userID;
        }
    }
}
