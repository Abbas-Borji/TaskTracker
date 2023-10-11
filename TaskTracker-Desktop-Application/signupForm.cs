using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement;

namespace TaskTracker_Application
{
    public partial class signupForm : Form
    {
        user temp = new user();
        public signupForm()
        {
            InitializeComponent();
        }

        private void buttonSignup_Click(object sender, EventArgs e)
        {
            try
            {
                PMISEntities tempEntities = new PMISEntities();
                temp.fullName = textFullName.Text;
                temp.email = textEmail.Text;
                temp.username = textUsername.Text;
                temp.password = textPassword.Text;
                temp.role = "Employee";
                temp.deleted = false;
                tempEntities.users.Add(temp);
                tempEntities.SaveChanges();
                loginForm newForm = new loginForm(temp.username, temp.password);
                newForm.Show();
                this.Hide();
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void linkLabelSignup_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            loginForm newForm = new loginForm();
            newForm.Show();
            this.Hide();
        }
    }
}
