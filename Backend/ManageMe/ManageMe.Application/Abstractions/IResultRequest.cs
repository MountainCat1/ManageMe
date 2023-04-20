using Catut;
using MediatR;

namespace ManageMe.Application.Abstractions;

public interface IResultRequest<T> : IRequest<Result<T>>
{
}

public interface IResultRequest : IRequest<Result>
{
}