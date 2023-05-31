namespace TaskTracker_Application
{
    partial class signupForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(signupForm));
            this.groupBoxLogin = new System.Windows.Forms.GroupBox();
            this.linkLabelSignup = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.labelFullName = new System.Windows.Forms.Label();
            this.textFullName = new System.Windows.Forms.TextBox();
            this.labelEmail = new System.Windows.Forms.Label();
            this.textEmail = new System.Windows.Forms.TextBox();
            this.labelPassword = new System.Windows.Forms.Label();
            this.textPassword = new System.Windows.Forms.TextBox();
            this.labelUsername = new System.Windows.Forms.Label();
            this.buttonSignup = new System.Windows.Forms.Button();
            this.textUsername = new System.Windows.Forms.TextBox();
            this.groupBoxLogin.SuspendLayout();
            this.SuspendLayout();
            // 
            // groupBoxLogin
            // 
            this.groupBoxLogin.Controls.Add(this.linkLabelSignup);
            this.groupBoxLogin.Controls.Add(this.label1);
            this.groupBoxLogin.Controls.Add(this.labelFullName);
            this.groupBoxLogin.Controls.Add(this.textFullName);
            this.groupBoxLogin.Controls.Add(this.labelEmail);
            this.groupBoxLogin.Controls.Add(this.textEmail);
            this.groupBoxLogin.Controls.Add(this.labelPassword);
            this.groupBoxLogin.Controls.Add(this.textPassword);
            this.groupBoxLogin.Controls.Add(this.labelUsername);
            this.groupBoxLogin.Controls.Add(this.buttonSignup);
            this.groupBoxLogin.Controls.Add(this.textUsername);
            this.groupBoxLogin.Font = new System.Drawing.Font("Cambria", 16.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBoxLogin.Location = new System.Drawing.Point(44, 45);
            this.groupBoxLogin.Name = "groupBoxLogin";
            this.groupBoxLogin.Size = new System.Drawing.Size(419, 509);
            this.groupBoxLogin.TabIndex = 4;
            this.groupBoxLogin.TabStop = false;
            this.groupBoxLogin.Text = "Create Account";
            // 
            // linkLabelSignup
            // 
            this.linkLabelSignup.AutoSize = true;
            this.linkLabelSignup.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.linkLabelSignup.Location = new System.Drawing.Point(255, 383);
            this.linkLabelSignup.Name = "linkLabelSignup";
            this.linkLabelSignup.Size = new System.Drawing.Size(48, 18);
            this.linkLabelSignup.TabIndex = 10;
            this.linkLabelSignup.TabStop = true;
            this.linkLabelSignup.Text = "Login";
            this.linkLabelSignup.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLabelSignup_LinkClicked);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Arial", 8F);
            this.label1.Location = new System.Drawing.Point(69, 383);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(172, 16);
            this.label1.TabIndex = 9;
            this.label1.Text = "Already have an account?";
            // 
            // labelFullName
            // 
            this.labelFullName.AutoSize = true;
            this.labelFullName.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelFullName.Location = new System.Drawing.Point(69, 65);
            this.labelFullName.Name = "labelFullName";
            this.labelFullName.Size = new System.Drawing.Size(103, 23);
            this.labelFullName.TabIndex = 8;
            this.labelFullName.Text = "Full Name:";
            // 
            // textFullName
            // 
            this.textFullName.BackColor = System.Drawing.Color.WhiteSmoke;
            this.textFullName.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.textFullName.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textFullName.Location = new System.Drawing.Point(72, 95);
            this.textFullName.Name = "textFullName";
            this.textFullName.Size = new System.Drawing.Size(267, 30);
            this.textFullName.TabIndex = 7;
            // 
            // labelEmail
            // 
            this.labelEmail.AutoSize = true;
            this.labelEmail.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelEmail.Location = new System.Drawing.Point(69, 145);
            this.labelEmail.Name = "labelEmail";
            this.labelEmail.Size = new System.Drawing.Size(64, 23);
            this.labelEmail.TabIndex = 6;
            this.labelEmail.Text = "Email:";
            // 
            // textEmail
            // 
            this.textEmail.BackColor = System.Drawing.Color.WhiteSmoke;
            this.textEmail.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.textEmail.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textEmail.Location = new System.Drawing.Point(72, 175);
            this.textEmail.Name = "textEmail";
            this.textEmail.Size = new System.Drawing.Size(267, 30);
            this.textEmail.TabIndex = 5;
            // 
            // labelPassword
            // 
            this.labelPassword.AutoSize = true;
            this.labelPassword.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelPassword.Location = new System.Drawing.Point(69, 306);
            this.labelPassword.Name = "labelPassword";
            this.labelPassword.Size = new System.Drawing.Size(104, 23);
            this.labelPassword.TabIndex = 4;
            this.labelPassword.Text = "Password:";
            // 
            // textPassword
            // 
            this.textPassword.BackColor = System.Drawing.Color.WhiteSmoke;
            this.textPassword.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.textPassword.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textPassword.Location = new System.Drawing.Point(72, 336);
            this.textPassword.Name = "textPassword";
            this.textPassword.PasswordChar = '*';
            this.textPassword.Size = new System.Drawing.Size(267, 30);
            this.textPassword.TabIndex = 3;
            // 
            // labelUsername
            // 
            this.labelUsername.AutoSize = true;
            this.labelUsername.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelUsername.Location = new System.Drawing.Point(69, 225);
            this.labelUsername.Name = "labelUsername";
            this.labelUsername.Size = new System.Drawing.Size(105, 23);
            this.labelUsername.TabIndex = 1;
            this.labelUsername.Text = "Username:";
            // 
            // buttonSignup
            // 
            this.buttonSignup.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonSignup.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonSignup.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonSignup.Location = new System.Drawing.Point(149, 423);
            this.buttonSignup.Name = "buttonSignup";
            this.buttonSignup.Size = new System.Drawing.Size(117, 49);
            this.buttonSignup.TabIndex = 2;
            this.buttonSignup.Text = "Sign Up";
            this.buttonSignup.UseVisualStyleBackColor = false;
            this.buttonSignup.Click += new System.EventHandler(this.buttonSignup_Click);
            // 
            // textUsername
            // 
            this.textUsername.BackColor = System.Drawing.Color.WhiteSmoke;
            this.textUsername.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.textUsername.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textUsername.Location = new System.Drawing.Point(72, 255);
            this.textUsername.Name = "textUsername";
            this.textUsername.Size = new System.Drawing.Size(267, 30);
            this.textUsername.TabIndex = 0;
            // 
            // signupForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(509, 602);
            this.Controls.Add(this.groupBoxLogin);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "signupForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "PMIS";
            this.Load += new System.EventHandler(this.signupForm_Load);
            this.groupBoxLogin.ResumeLayout(false);
            this.groupBoxLogin.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.GroupBox groupBoxLogin;
        private System.Windows.Forms.Label labelFullName;
        private System.Windows.Forms.TextBox textFullName;
        private System.Windows.Forms.Label labelEmail;
        private System.Windows.Forms.TextBox textEmail;
        private System.Windows.Forms.Label labelPassword;
        private System.Windows.Forms.TextBox textPassword;
        private System.Windows.Forms.Label labelUsername;
        private System.Windows.Forms.Button buttonSignup;
        private System.Windows.Forms.TextBox textUsername;
        private System.Windows.Forms.LinkLabel linkLabelSignup;
        private System.Windows.Forms.Label label1;
    }
}