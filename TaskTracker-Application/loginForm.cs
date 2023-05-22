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
        public loginForm()
        {
            InitializeComponent();
        }

        private void buttonLogin_Click(object sender, EventArgs e)
        {
            PMISEntities tempEntities = new PMISEntities();
            temp.fullName = textBox1.Text;
            temp.email = textBox2.Text;
            temp.username = textBox3.Text;
            temp.password = textBox4.Text;
            temp.role = textBox5.Text;
            tempEntities.users.Add(temp);
            tempEntities.SaveChanges();
        }

        private void loginForm_Load(object sender, EventArgs e)
        {
            populateDGV();
        }

        private void populateDGV()
        {
            PMISEntities tempEntities = new PMISEntities();
            usersDGV.DataSource = tempEntities.users.ToList<user>();
        }
    }
}
