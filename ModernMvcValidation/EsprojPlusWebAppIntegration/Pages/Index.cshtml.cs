using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.ComponentModel.DataAnnotations;

namespace EsprojPlusWebAppIntegration.Pages;
public class IndexModel(ILogger<IndexModel> logger) : PageModel
{
    [BindProperty]
    public Customer Customer { get; set; }

    public void OnGet()
    {

    }
}

public class Customer
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; }

    [Range(18, 100)]
    public int Age { get; set; }

    [Required]
    public string PassportNumber { get; set; }

    [Required]
    [Compare("PassportNumber", ErrorMessage = "Passport number and confirm passport number do not match.")]
    public string ConfirmPassportNumber { get; set; }

    [Required]
    [StringLength(50)]
    public string Address { get; set; }

    [Required]
    public string City { get; set; }

    [Required]
    [RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$", ErrorMessage = "Characters are not allowed.")]
    public string Region { get; set; }

    [Required]
    [StringLength(5, MinimumLength = 5, ErrorMessage = "Postal code must have 5 digits")]
    [RegularExpression(@"^\d{5}$", ErrorMessage = "Must not contain letters")]
    public string PostalCode { get; set; }

    [Required]
    public string Country { get; set; }

    [Phone]
    public string Phone { get; set; }

    [Phone]
    public string Fax { get; set; }

    [Url]
    public string HomeUrl { get; set; }

    [EmailAddress]
    public string Email { get; set; }
}
