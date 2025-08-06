using System;
using System.Collections.Generic;

namespace AcadEvalSys.Domain.Entities
{
    public class FormQuestion : BaseEntity
    {
        public string? Text { get; set; }
        public bool IsRequired { get; set; }
        public int Order { get; set; }

        public virtual ICollection<QuestionResponse>? QuestionResponses { get; set; } = new List<QuestionResponse>();
    }
}
    