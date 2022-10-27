using aspnetserver.Data;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORSPolicy",
        builder =>
        {
            builder.AllowAnyMethod()
            .AllowAnyHeader()
            .WithOrigins("http://localhost:3000", "https://appname.azurestaticapps.net");
        });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(sOptions =>
{
    sOptions.SwaggerDoc("v1", new OpenApiInfo { Title = "ASP.NET React Tutorial", Version = "v1" });
});

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI(sOptions =>
{
    sOptions.DocumentTitle = "ASP.NET React Tutorial";
    sOptions.SwaggerEndpoint("/swagger/v1/swagger.json", "Web API serving a very simple Post model.");
    sOptions.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();

app.UseCors("CORSPolicy");

app.MapGet("/get-all-posts", async () => await PostRepository.GetPostsAsync())
    .WithTags("Posts Endpoints");

app.MapGet("/get-post-by-id/{postId}", async (int postId) => {

    Post result = await PostRepository.GetPostByIdAsync(postId);
    
    if(result != null)
    {
        return Results.Ok(result);
    }
    else
    {
        return Results.BadRequest();
    }
    })
    .WithTags("Posts Endpoints");

app.MapPost("/create-post", async (Post postToCreate) => {

    bool resultSuccessful = await PostRepository.CreatePostAsync(postToCreate);


    if (resultSuccessful)
    {
        return Results.Ok("Create successful!");
    }
    else
    {
        return Results.BadRequest();
    }
})
    .WithTags("Posts Endpoints");

app.MapPut("/update-post", async (Post postToUpdate) => {

    bool resultSuccessful = await PostRepository.UpdatePostAsync(postToUpdate);


    if (resultSuccessful)
    {
        return Results.Ok("Update successful!");
    }
    else
    {
        return Results.BadRequest();
    }
})
    .WithTags("Posts Endpoints");

app.MapDelete("/delete-post-by-id/{postId}", async (int postId) => {

    bool resultSuccessful = await PostRepository.DeletePostAsync(postId);


    if (resultSuccessful)
    {
        return Results.Ok("Delete successful!");
    }
    else
    {
        return Results.BadRequest();
    }
})
    .WithTags("Posts Endpoints");

app.Run();
