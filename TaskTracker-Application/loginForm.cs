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

        private void loginForm_Load(object sender, EventArgs e)
        {
            
        }

        private void buttonLogin_Click(object sender, EventArgs e)
        {
            foreach (user user in users)
            {
                if (user.username == textUsername.Text)
                {
                    if (user.password == textPassword.Text)
                    {
                        role = user.role;
                        login();
                    }

                    else
                    {
                        MessageBox.Show("Incorrect Password");
                    }
                }

                else
                {
                    MessageBox.Show("Incorrect Username");
                }
            }
        }

        private void login()
        {
            Application.Exit();
            if(role == "Employee")
            {
                employeeForm newForm = new employeeForm();
                newForm.Show();
                this.Hide();
            }
            if(role == "Manager")
            {
                managerForm newForm = new managerForm();
                newForm.Show();
                this.Hide();
            }

        }

        private void loginEmployee() 
        {
            
        }

        private void loginManager()
        {
            
        }
    }
}
