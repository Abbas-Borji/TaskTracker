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
    public partial class updateUser : Form
    {
        static PMISEntities tempEntities = new PMISEntities();
        List<user> users = tempEntities.users.Where(user => user.deleted == false).ToList<user>();
        user temp = new user();
        public updateUser()
        {
            InitializeComponent();
        }

        public updateUser(int selectedUserID)
        {
            InitializeComponent();
            temp = users.FirstOrDefault(user => user.userID == selectedUserID);
        }

        private void buttonSignup_Click(object sender, EventArgs e)
        {
            try
            {
                temp.fullName = textFullName.Text;
                temp.email = textEmail.Text;
                temp.username = textUsername.Text;
                temp.password = textPassword.Text;
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

        private void updateUser_Load(object sender, EventArgs e)
        {
            textFullName.Text = temp.fullName;
            textEmail.Text = temp.email;
            textUsername.Text = temp.username;
            textPassword.Text = temp.password;
        }

        private void linkLabel1_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            adminForm newForm = new adminForm();
            newForm.Show();
            this.Hide();
        }
    }
}
