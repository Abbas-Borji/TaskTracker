//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TaskTracker_Application
{
    using System;
    using System.Collections.Generic;
    
    public partial class isQuestionOf
    {
        public int checklistID { get; set; }
        public int questionID { get; set; }
        public Nullable<bool> deleted { get; set; }
    
        public virtual checklist checklist { get; set; }
        public virtual question question { get; set; }
    }
}