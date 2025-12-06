namespace AcadEvalSys.Domain.Exceptions;

public class ForbidException : Exception
{
    public ForbidException() : base("Forbidden")
    {
    }

    public ForbidException(string message) : base(message)
    {
    }
}