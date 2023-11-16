using BlazorWebApp.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddScoped<RazorClassLibrary1.ExampleJsInterop>();
builder.Services.AddScoped<RclNoBundler.ExampleJsInterop>();
builder.Services.AddScoped<RclESBuild.ExampleJsInterop>();
builder.Services.AddScoped<RclParcel.ExampleJsInterop>();
builder.Services.AddScoped<RclRollup.ExampleJsInterop>();
builder.Services.AddScoped<RclRspack.ExampleJsInterop>();
builder.Services.AddScoped<RclVite.ExampleJsInterop>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();
app.UseAntiforgery();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
