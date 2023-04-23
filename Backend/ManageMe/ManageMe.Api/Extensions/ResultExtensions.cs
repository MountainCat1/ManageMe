using Catut;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace ManageMe.Api.Extensions;

public static class ResultExtensions
{
    public static IActionResult ToOk<TResult, TContract>(
        this Result<TResult> result, Func<TResult, TContract> mapper, int statusCode = 200)
    {
        return result.Match<IActionResult>(
            Succ: obj =>
            {
                var response = mapper(obj);
                return new ObjectResult(response)
                {
                    StatusCode = statusCode
                };
            },
            Fail: exception =>
            {
                return ProcessFail(exception);
            });
    }
    
    public static IActionResult ToOk<TResult>(
        this Result<TResult> result, int statusCode = 200)
    {
        return result.Match<IActionResult>(
            Succ: obj =>
            {
                return new ObjectResult(obj)
                {
                    StatusCode = statusCode
                };
            },
            Fail: exception =>
            {
                return ProcessFail(exception);
            });
    }
    
    public static IActionResult ToOk(
        this Result result, int statusCode = 200)
    {
        return result.Match<IActionResult>(
            Succ: () =>
            {
                return new StatusCodeResult(statusCode);
            },
            Fail: exception =>
            {
                return ProcessFail(exception);
            });
    }

    private static IActionResult ProcessFail(Exception exception)
    {
        if (exception is ValidationException validationException)
        {
            return new BadRequestObjectResult(validationException);
        }
                
        if (exception is UnauthorizedAccessException ex)
        {
            return new UnauthorizedObjectResult(ex);
        }

        throw exception;
        
        return new StatusCodeResult(500);
    }
}