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
    public partial class adminForm : Form
    {
        static PMISEntities tempEntities = new PMISEntities();
        List<user> users = tempEntities.users.ToList<user>();
        public adminForm()
        {
            InitializeComponent();
        }

        private void adminForm_Load(object sender, EventArgs e)
        {
            comboBoxUsers.DataSource = users.Where(user => user.role != "Admin").ToList();
            comboBoxUsers.DisplayMember = "fullName";
            comboBoxUsers.ValueMember = "userID";
        }

        private void listBoxUsers_SelectedIndexChanged(object sender, EventArgs e)
        {
            listBoxUsers.DataSource = users;
        }

        private void buttonUpdateUserRole_Click(object sender, EventArgs e)
        {
            try
            {
                int selectedID = Convert.ToInt32(comboBoxUsers.SelectedValue.ToString());
                string newRole = comboBoxRoles.SelectedItem.ToString();
                users.FirstOrDefault(user => user.userID == selectedID).role = newRole;
                tempEntities.SaveChanges();
                MessageBox.Show("Role was updated successfully!");
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void logoutToolStripMenuItem_Click(object sender, EventArgs e)
        {
            loginForm newForm = new loginForm();
            newForm.Show();
            this.Hide();
        }
    }
}
