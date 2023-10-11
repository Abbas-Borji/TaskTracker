using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskTracker_Application
{
    public static class Session
    {
        // Define variables to store session data
        public static string userName { get; set; }
        public static int userID { get; set; }
        // Add more variables as needed

        // Optional: Initialize session data
        public static void Initialize()
        {
            userName = string.Empty;
            userID = 0;
            // Initialize other variables
        }
    }
}
