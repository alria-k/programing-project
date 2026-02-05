using Microsoft.EntityFrameworkCore;
using FinanceTracker;
using FinanceTracker.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5174", "http://localhost:5173")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<FinanceTrackerDbContext>(options =>
    options.UseSqlite(connectionString));

builder.Services.AddCors(options => {
    options.AddDefaultPolicy(policy => {
        policy.WithOrigins("http://localhost:5174", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<FinanceTrackerDbContext>();


    db.Database.EnsureCreated();

    if (!db.Users.Any())
    {
        db.Users.Add(new User
        {
            Username = "Vlad",
            Email = "hello@example.com",
            PasswordHash = "123456",
            Role = "user"
        });
        db.SaveChanges();
    }
}
app.UseCors("AllowReactApp");

app.UseAuthorization();
app.MapControllers();
app.Run();

app.UseHttpsRedirection();

app.UseCors();

app.UseAuthorization();

app.MapControllers();

app.Run();
