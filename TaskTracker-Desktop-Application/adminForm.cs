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
        string userName = Session.userName;
        int userID = Session.userID;
        static PMISEntities tempEntities = new PMISEntities();
        List<user> users = tempEntities.users.Where(user => user.deleted == false).ToList<user>();
        List<checklist> checklists = tempEntities.checklists.Where(checklist => checklist.deleted == false).ToList<checklist>();

        public adminForm()
        {
            InitializeComponent();
        }

        private void adminForm_Load(object sender, EventArgs e)
        {
            refreshUsersList();
            refreshChecklistsList();
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

        private void buttonDeleteUser_Click(object sender, EventArgs e)
        {
            try
            {
                int selectedID = Convert.ToInt32(listBoxUsers.SelectedValue.ToString());
                users.FirstOrDefault(user => user.userID == selectedID).deleted = true;
                tempEntities.SaveChanges();
                refreshUsersList();
                MessageBox.Show("User was deleted successfully!");
            }
            catch (Exception)
            {

                throw;
            }
        }

        private void refreshUsersList()
        {
            List<user> newUsers = tempEntities.users.Where(user => user.deleted == false).ToList();

            comboBoxUsers.DataSource = newUsers.Where(user => user.role != "Admin").ToList();
            listBoxUsers.DataSource = newUsers.Where(user => user.role != "Admin").ToList();

            setListControlDisplayAndValueMembers(comboBoxUsers);
            setListControlDisplayAndValueMembers(listBoxUsers);
        }

        private void setListControlDisplayAndValueMembers(ListControl listControl)
        {
            listControl.DisplayMember = "fullName";
            listControl.ValueMember = "userID";
        }

        private void refreshRolesList()
        {            
            user selectedUser = (user)comboBoxUsers.SelectedItem;
            int selectedID = selectedUser.userID;
            string currentRole = users.FirstOrDefault(user => user.userID == selectedID)?.role;

            if (currentRole != null)
            {
                comboBoxRoles.SelectedItem = currentRole;
            }
        }

        private void comboBoxUsers_SelectedIndexChanged(object sender, EventArgs e)
        {
            refreshRolesList();
            listBoxUsers.SelectedItem = comboBoxUsers.SelectedItem;
        }

        private void listBoxUsers_SelectedIndexChanged(object sender, EventArgs e)
        {
            comboBoxUsers.SelectedItem = listBoxUsers.SelectedItem;
        }

        private void buttonAddUser_Click(object sender, EventArgs e)
        {
            addUser newForm = new addUser();
            newForm.Show();
            this.Hide();
        }

        private void buttonUpdateUserInfo_Click(object sender, EventArgs e)
        {
            int selectedID = Convert.ToInt32(listBoxUsers.SelectedValue.ToString());
            updateUser newForm = new updateUser(selectedID);
            newForm.Show();
            this.Hide();
        }

        private void buttonCreateChecklist_Click(object sender, EventArgs e)
        {
            createChecklist newForm = new createChecklist();
            newForm.Show();
            this.Hide();
        }

        private void refreshChecklistsList()
        {
            List<checklist> newChecklists = tempEntities.checklists.Where(checklist => checklist.deleted == false).ToList();
            listBoxChecklists.DataSource = newChecklists;
            listBoxChecklists.DisplayMember = "name";
            listBoxChecklists.ValueMember = "checklistID";
        }

    }
}
