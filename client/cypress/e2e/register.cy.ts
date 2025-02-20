/** @format */

describe("Register Page E2E", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("successfully registers a new user", () => {
    const username = `testuser${Math.floor(Math.random() * 10000)}`;
    const email = `${username}@example.com`;
    const password = "testPassword123";

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
  });

  it("shows error message for existing email", () => {
    // Use an email that already exists in your system
    cy.get('input[name="username"]').type("existinguser");
    cy.get('input[name="email"]').type("existing@example.com");
    cy.get('input[name="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    cy.get(".text-red-500").should("exist");
  });

  it("navigates to login page", () => {
    cy.contains("Already have an account?").click();
    cy.url().should("include", "/login");
  });

  it("validates form fields", () => {
    // Test username validation
    cy.get('input[name="username"]').type("ab").blur();
    cy.get('button[type="submit"]').click();

    // Test email validation
    cy.get('input[name="email"]').type("invalid-email").blur();

    // Test password validation
    cy.get('input[name="password"]').type("12345").blur();
  });
});
