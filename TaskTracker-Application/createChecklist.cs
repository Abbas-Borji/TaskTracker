using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Forms;

namespace TaskTracker_Application
{
    public partial class createChecklist : Form
    {
        private static PMISEntities tempEntities = new PMISEntities();
        private List<checklist> checklists = tempEntities.checklists.Where(checklist => checklist.deleted == false).ToList();
        private checklist temp = new checklist();
        int managerID = Session.userID;

        public createChecklist()
        {
            InitializeComponent();
        }

        private void linkLabel1_LinkClicked_1(object sender, LinkLabelLinkClickedEventArgs e)
        {
            adminForm newForm = new adminForm();
            newForm.Show();
            Hide();
        }

        private void buttonCreateChecklist_Click(object sender, EventArgs e)
        {
            try
            {

                temp.name = textChecklistName.Text;
                temp.managerID = managerID;
                temp.deleted = false;
                temp.createdAt = DateTime.Now;
                
                tempEntities.checklists.Add(temp);
                tempEntities.SaveChanges();

                MessageBox.Show("Checklist Created Successfully!");
            }

            catch (Exception)
            {
                throw;
            }
        }
    }
}