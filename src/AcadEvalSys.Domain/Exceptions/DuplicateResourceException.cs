namespace AcadEvalSys.Domain.Exceptions;

public class DuplicateResourceException(string resourceType, string resourceIdentifier) : 
    Exception($"Ya existe un {resourceType.ToLower()} con el identificador '{resourceIdentifier}'")
{
    
}