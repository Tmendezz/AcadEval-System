using System;

namespace AcadEvalSys.Domain.Exceptions;

public class UserRoleAssignmentException : Exception
{
    public UserRoleAssignmentException(string message) : base(message) { }

    public UserRoleAssignmentException(string message, Exception innerException) : base(message, innerException) { }
}