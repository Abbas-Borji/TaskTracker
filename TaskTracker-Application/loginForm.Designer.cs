namespace TaskTracker_Application
{
    partial class loginForm
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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(loginForm));
            this.textUsername = new System.Windows.Forms.TextBox();
            this.labelUsername = new System.Windows.Forms.Label();
            this.buttonLogin = new System.Windows.Forms.Button();
            this.groupBoxLogin = new System.Windows.Forms.GroupBox();
            this.linkLabelSignup = new System.Windows.Forms.LinkLabel();
            this.label1 = new System.Windows.Forms.Label();
            this.labelPassword = new System.Windows.Forms.Label();
            this.textPassword = new System.Windows.Forms.TextBox();
            this.groupBoxLogin.SuspendLayout();
            this.SuspendLayout();
            // 
            // textUsername
            // 
            this.textUsername.BackColor = System.Drawing.Color.WhiteSmoke;
            this.textUsername.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.textUsername.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.textUsername.Location = new System.Drawing.Point(78, 91);
            this.textUsername.Name = "textUsername";
            this.textUsername.Size = new System.Drawing.Size(267, 30);
            this.textUsername.TabIndex = 0;
            // 
            // labelUsername
            // 
            this.labelUsername.AutoSize = true;
            this.labelUsername.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelUsername.Location = new System.Drawing.Point(75, 61);
            this.labelUsername.Name = "labelUsername";
            this.labelUsername.Size = new System.Drawing.Size(105, 23);
            this.labelUsername.TabIndex = 1;
            this.labelUsername.Text = "Username:";
            // 
            // buttonLogin
            // 
            this.buttonLogin.BackColor = System.Drawing.Color.SteelBlue;
            this.buttonLogin.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.buttonLogin.ForeColor = System.Drawing.Color.WhiteSmoke;
            this.buttonLogin.Location = new System.Drawing.Point(155, 250);
            this.buttonLogin.Name = "buttonLogin";
            this.buttonLogin.Size = new System.Drawing.Size(117, 49);
            this.buttonLogin.TabIndex = 2;
            this.buttonLogin.Text = "Sign In";
            this.buttonLogin.UseVisualStyleBackColor = false;
            this.buttonLogin.Click += new System.EventHandler(this.buttonLogin_Click);
            // 
            // groupBoxLogin
            // 
            this.groupBoxLogin.Controls.Add(this.linkLabelSignup);
            this.groupBoxLogin.Controls.Add(this.label1);
            this.groupBoxLogin.Controls.Add(this.labelPassword);
            this.groupBoxLogin.Controls.Add(this.textPassword);
            this.groupBoxLogin.Controls.Add(this.labelUsername);
            this.groupBoxLogin.Controls.Add(this.buttonLogin);
            this.groupBoxLogin.Controls.Add(this.textUsername);
            this.groupBoxLogin.Font = new System.Drawing.Font("Cambria", 16.2F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.groupBoxLogin.Location = new System.Drawing.Point(28, 31);
            this.groupBoxLogin.Name = "groupBoxLogin";
            this.groupBoxLogin.Size = new System.Drawing.Size(431, 340);
            this.groupBoxLogin.TabIndex = 3;
            this.groupBoxLogin.TabStop = false;
            this.groupBoxLogin.Text = "Login";
            // 
            // linkLabelSignup
            // 
            this.linkLabelSignup.AutoSize = true;
            this.linkLabelSignup.Font = new System.Drawing.Font("Arial", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.linkLabelSignup.Location = new System.Drawing.Point(262, 217);
            this.linkLabelSignup.Name = "linkLabelSignup";
            this.linkLabelSignup.Size = new System.Drawing.Size(69, 18);
            this.linkLabelSignup.TabIndex = 5;
            this.linkLabelSignup.TabStop = true;
            this.linkLabelSignup.Text = "Register";
            this.linkLabelSignup.LinkClicked += new System.Windows.Forms.LinkLabelLinkClickedEventHandler(this.linkLabelSignup_LinkClicked);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Arial", 8F);
            this.label1.Location = new System.Drawing.Point(76, 217);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(180, 16);
            this.label1.TabIndex = 4;
            this.label1.Text = "Don\'t have an account yet?";
            this.label1.Click += new System.EventHandler(this.label1_Click);
            // 
            // labelPassword
            // 
            this.labelPassword.AutoSize = true;
            this.labelPassword.Font = new System.Drawing.Font("Arial", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.labelPassword.Location = new System.Drawing.Point(75, 142);
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
            this.textPassword.Location = new System.Drawing.Point(78, 172);
            this.textPassword.Name = "textPassword";
            this.textPassword.PasswordChar = '*';
            this.textPassword.Size = new System.Drawing.Size(267, 30);
            this.textPassword.TabIndex = 3;
            // 
            // loginForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 16F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(509, 416);
            this.Controls.Add(this.groupBoxLogin);
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "loginForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "PMIS";
            this.Load += new System.EventHandler(this.loginForm_Load);
            this.groupBoxLogin.ResumeLayout(false);
            this.groupBoxLogin.PerformLayout();
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.TextBox textUsername;
        private System.Windows.Forms.Label labelUsername;
        private System.Windows.Forms.Button buttonLogin;
        private System.Windows.Forms.GroupBox groupBoxLogin;
        private System.Windows.Forms.Label labelPassword;
        private System.Windows.Forms.TextBox textPassword;
        private System.Windows.Forms.LinkLabel linkLabelSignup;
        private System.Windows.Forms.Label label1;
    }
}

