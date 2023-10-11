namespace TaskTracker_Application
{
    partial class adminForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(adminForm));
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.buttonUpdateUserRole = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.comboBoxRoles = new System.Windows.Forms.ComboBox();
            this.label1 = new System.Windows.Forms.Label();
            this.comboBoxUsers = new System.Windows.Forms.ComboBox();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.buttonCreateChecklist = new System.Windows.Forms.Button();
            this.buttonEditChecklist = new System.Windows.Forms.Button();
            this.listBoxChecklists = new System.Windows.Forms.ListBox();
            this.buttonDeleteChecklist = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.buttonAddUser = new System.Windows.Forms.Button();
            this.buttonUpdateUserInfo = new System.Windows.Forms.Button();
            this.buttonDeleteUser = new System.Windows.Forms.Button();
            this.listBoxUsers = new System.Windows.Forms.ListBox();
            this.menuStrip1 = new System.Windows.Forms.MenuStrip();
            this.logoutToolStripMenuItem = new System.Windows.Forms.ToolStripMenuItem();
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            this.menuStrip1.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBox1
            // 
            this.groupBox1.BackColor = System.Drawing.Color.White;
            this.groupBox1.Controls.Add(this.buttonUpdateUserRole);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.comboBoxRoles);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.comboBoxUsers);
            this.groupBox1.Font = new System.Drawing.Font("Cambria", 16.2F);
            this.groupBox1.Location = new System.Drawing.Point(43, 49);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(712, 308);
            this.groupBox1.TabIndex = 0;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Change Access";
            // 
            // buttonUpdateUserRole
            // 
            this.buttonUpdateUserRole.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonUpdateUserRole.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonUpdateUserRole.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonUpdateUserRole.Location = new System.Drawing.Point(492, 155);
            this.buttonUpdateUserRole.Name = "buttonUpdateUserRole";
            this.buttonUpdateUserRole.Size = new System.Drawing.Size(132, 39);
            this.buttonUpdateUserRole.TabIndex = 8;
            this.buttonUpdateUserRole.Text = "Update Role";
            this.buttonUpdateUserRole.UseVisualStyleBackColor = false;
            this.buttonUpdateUserRole.Click += new System.EventHandler(this.buttonUpdateUserRole_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Arial", 10F);
            this.label2.Location = new System.Drawing.Point(56, 175);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(91, 19);
            this.label2.TabIndex = 3;
            this.label2.Text = "Select Role";
            // 
            // comboBoxRoles
            // 
            this.comboBoxRoles.AutoCompleteCustomSource.AddRange(new string[] {
            "Employee",
            "Manager"});
            this.comboBoxRoles.Font = new System.Drawing.Font("Arial", 10F);
            this.comboBoxRoles.FormattingEnabled = true;
            this.comboBoxRoles.Items.AddRange(new object[] {
            "Employee",
            "Manager"});
            this.comboBoxRoles.Location = new System.Drawing.Point(60, 206);
            this.comboBoxRoles.Name = "comboBoxRoles";
            this.comboBoxRoles.Size = new System.Drawing.Size(292, 27);
            this.comboBoxRoles.TabIndex = 2;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Arial", 10F);
            this.label1.Location = new System.Drawing.Point(56, 67);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(93, 19);
            this.label1.TabIndex = 1;
            this.label1.Text = "Select User";
            // 
            // comboBoxUsers
            // 
            this.comboBoxUsers.Font = new System.Drawing.Font("Arial", 10F);
            this.comboBoxUsers.FormattingEnabled = true;
            this.comboBoxUsers.Location = new System.Drawing.Point(60, 104);
            this.comboBoxUsers.Name = "comboBoxUsers";
            this.comboBoxUsers.Size = new System.Drawing.Size(292, 27);
            this.comboBoxUsers.TabIndex = 0;
            this.comboBoxUsers.SelectedIndexChanged += new System.EventHandler(this.comboBoxUsers_SelectedIndexChanged);
            // 
            // groupBox2
            // 
            this.groupBox2.BackColor = System.Drawing.Color.White;
            this.groupBox2.Controls.Add(this.buttonCreateChecklist);
            this.groupBox2.Controls.Add(this.buttonEditChecklist);
            this.groupBox2.Controls.Add(this.listBoxChecklists);
            this.groupBox2.Controls.Add(this.buttonDeleteChecklist);
            this.groupBox2.Font = new System.Drawing.Font("Cambria", 16.2F);
            this.groupBox2.Location = new System.Drawing.Point(43, 401);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(712, 308);
            this.groupBox2.TabIndex = 1;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Edit Checklists";
            // 
            // buttonCreateChecklist
            // 
            this.buttonCreateChecklist.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonCreateChecklist.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonCreateChecklist.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonCreateChecklist.Location = new System.Drawing.Point(492, 62);
            this.buttonCreateChecklist.Name = "buttonCreateChecklist";
            this.buttonCreateChecklist.Size = new System.Drawing.Size(179, 39);
            this.buttonCreateChecklist.TabIndex = 10;
            this.buttonCreateChecklist.Text = "Create Checklist";
            this.buttonCreateChecklist.UseVisualStyleBackColor = false;
            this.buttonCreateChecklist.Click += new System.EventHandler(this.buttonCreateChecklist_Click);
            // 
            // buttonEditChecklist
            // 
            this.buttonEditChecklist.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonEditChecklist.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonEditChecklist.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonEditChecklist.Location = new System.Drawing.Point(492, 150);
            this.buttonEditChecklist.Name = "buttonEditChecklist";
            this.buttonEditChecklist.Size = new System.Drawing.Size(179, 39);
            this.buttonEditChecklist.TabIndex = 9;
            this.buttonEditChecklist.Text = "Edit Checklist";
            this.buttonEditChecklist.UseVisualStyleBackColor = false;
            // 
            // listBoxChecklists
            // 
            this.listBoxChecklists.Font = new System.Drawing.Font("Arial", 10F);
            this.listBoxChecklists.FormattingEnabled = true;
            this.listBoxChecklists.ItemHeight = 19;
            this.listBoxChecklists.Location = new System.Drawing.Point(29, 62);
            this.listBoxChecklists.Name = "listBoxChecklists";
            this.listBoxChecklists.Size = new System.Drawing.Size(408, 213);
            this.listBoxChecklists.TabIndex = 8;
            // 
            // buttonDeleteChecklist
            // 
            this.buttonDeleteChecklist.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonDeleteChecklist.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonDeleteChecklist.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonDeleteChecklist.Location = new System.Drawing.Point(492, 236);
            this.buttonDeleteChecklist.Name = "buttonDeleteChecklist";
            this.buttonDeleteChecklist.Size = new System.Drawing.Size(179, 39);
            this.buttonDeleteChecklist.TabIndex = 8;
            this.buttonDeleteChecklist.Text = "Delete Checklist";
            this.buttonDeleteChecklist.UseVisualStyleBackColor = false;
            // 
            // groupBox3
            // 
            this.groupBox3.BackColor = System.Drawing.Color.White;
            this.groupBox3.Controls.Add(this.buttonAddUser);
            this.groupBox3.Controls.Add(this.buttonUpdateUserInfo);
            this.groupBox3.Controls.Add(this.buttonDeleteUser);
            this.groupBox3.Controls.Add(this.listBoxUsers);
            this.groupBox3.Font = new System.Drawing.Font("Cambria", 16.2F);
            this.groupBox3.Location = new System.Drawing.Point(835, 50);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(473, 666);
            this.groupBox3.TabIndex = 2;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Edit Users";
            // 
            // buttonAddUser
            // 
            this.buttonAddUser.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonAddUser.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonAddUser.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonAddUser.Location = new System.Drawing.Point(37, 597);
            this.buttonAddUser.Name = "buttonAddUser";
            this.buttonAddUser.Size = new System.Drawing.Size(132, 39);
            this.buttonAddUser.TabIndex = 7;
            this.buttonAddUser.Text = "Add User";
            this.buttonAddUser.UseVisualStyleBackColor = false;
            this.buttonAddUser.Click += new System.EventHandler(this.buttonAddUser_Click);
            // 
            // buttonUpdateUserInfo
            // 
            this.buttonUpdateUserInfo.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonUpdateUserInfo.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonUpdateUserInfo.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonUpdateUserInfo.Location = new System.Drawing.Point(175, 597);
            this.buttonUpdateUserInfo.Name = "buttonUpdateUserInfo";
            this.buttonUpdateUserInfo.Size = new System.Drawing.Size(132, 39);
            this.buttonUpdateUserInfo.TabIndex = 6;
            this.buttonUpdateUserInfo.Text = "Update User";
            this.buttonUpdateUserInfo.UseVisualStyleBackColor = false;
            this.buttonUpdateUserInfo.Click += new System.EventHandler(this.buttonUpdateUserInfo_Click);
            // 
            // buttonDeleteUser
            // 
            this.buttonDeleteUser.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonDeleteUser.Font = new System.Drawing.Font("Arial", 10F);
            this.buttonDeleteUser.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonDeleteUser.Location = new System.Drawing.Point(313, 597);
            this.buttonDeleteUser.Name = "buttonDeleteUser";
            this.buttonDeleteUser.Size = new System.Drawing.Size(132, 39);
            this.buttonDeleteUser.TabIndex = 5;
            this.buttonDeleteUser.Text = "Delete User";
            this.buttonDeleteUser.UseVisualStyleBackColor = false;
            this.buttonDeleteUser.Click += new System.EventHandler(this.buttonDeleteUser_Click);
            // 
            // listBoxUsers
            // 
            this.listBoxUsers.Font = new System.Drawing.Font("Arial", 10F);
            this.listBoxUsers.FormattingEnabled = true;
            this.listBoxUsers.ItemHeight = 19;
            this.listBoxUsers.Location = new System.Drawing.Point(37, 50);
            this.listBoxUsers.Name = "listBoxUsers";
            this.listBoxUsers.Size = new System.Drawing.Size(408, 517);
            this.listBoxUsers.TabIndex = 4;
            this.listBoxUsers.SelectedIndexChanged += new System.EventHandler(this.listBoxUsers_SelectedIndexChanged);
            // 
            // menuStrip1
            // 
            this.menuStrip1.GripMargin = new System.Windows.Forms.Padding(2);
            this.menuStrip1.ImageScalingSize = new System.Drawing.Size(20, 20);
            this.menuStrip1.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.logoutToolStripMenuItem});
            this.menuStrip1.Location = new System.Drawing.Point(0, 0);
            this.menuStrip1.Margin = new System.Windows.Forms.Padding(12, 0, 0, 0);
            this.menuStrip1.MinimumSize = new System.Drawing.Size(0, 35);
            this.menuStrip1.Name = "menuStrip1";
            this.menuStrip1.Size = new System.Drawing.Size(1382, 35);
            this.menuStrip1.TabIndex = 3;
            this.menuStrip1.Text = "menuStrip1";
            // 
            // logoutToolStripMenuItem
            // 
            this.logoutToolStripMenuItem.BackColor = System.Drawing.Color.LightCoral;
            this.logoutToolStripMenuItem.Font = new System.Drawing.Font("Segoe UI", 8F);
            this.logoutToolStripMenuItem.Margin = new System.Windows.Forms.Padding(0, 2, 0, 2);
            this.logoutToolStripMenuItem.Name = "logoutToolStripMenuItem";
            this.logoutToolStripMenuItem.Size = new System.Drawing.Size(67, 27);
            this.logoutToolStripMenuItem.Text = "Logout";
            this.logoutToolStripMenuItem.Click += new System.EventHandler(this.logoutToolStripMenuItem_Click);
            // 
            // adminForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(1382, 753);
            this.Controls.Add(this.groupBox3);
            this.Controls.Add(this.groupBox2);
            this.Controls.Add(this.groupBox1);
            this.Controls.Add(this.menuStrip1);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MainMenuStrip = this.menuStrip1;
            this.Name = "adminForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "PMIS";
            this.Load += new System.EventHandler(this.adminForm_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox3.ResumeLayout(false);
            this.menuStrip1.ResumeLayout(false);
            this.menuStrip1.PerformLayout();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.ComboBox comboBoxUsers;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox comboBoxRoles;
        private System.Windows.Forms.ListBox listBoxUsers;
        private System.Windows.Forms.Button buttonDeleteUser;
        private System.Windows.Forms.Button buttonUpdateUserRole;
        private System.Windows.Forms.Button buttonAddUser;
        private System.Windows.Forms.Button buttonUpdateUserInfo;
        private System.Windows.Forms.MenuStrip menuStrip1;
        private System.Windows.Forms.ToolStripMenuItem logoutToolStripMenuItem;
        private System.Windows.Forms.Button buttonCreateChecklist;
        private System.Windows.Forms.Button buttonEditChecklist;
        private System.Windows.Forms.ListBox listBoxChecklists;
        private System.Windows.Forms.Button buttonDeleteChecklist;
    }
}