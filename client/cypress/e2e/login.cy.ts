describe("Login Page E2E", () => {
  beforeEach(() => {
    cy.visit("/login");
  });

  it("renders login form", () => {
    cy.get('[data-test="email-input"]').should("exist");
    cy.get('[data-test="password-input"]').should("exist");
    cy.get('[data-test="login-button"]').should("contain", "Login");
  });

  it("handles input changes", () => {
    cy.get('[data-test="email-input"]').type("test@example.com");
    cy.get('[data-test="password-input"]').type("password123");

    cy.get('[data-test="email-input"]').should(
      "have.value",
      "test@example.com"
    );
    cy.get('[data-test="password-input"]').should("have.value", "password123");
  });

  it("shows validation errors for empty fields", () => {
    cy.get('[data-test="login-button"]').click();
  });

  it("shows error for invalid credentials", () => {
    cy.get('[data-test="email-input"]').type("wrong@example.com");
    cy.get('[data-test="password-input"]').type("wrongpassword");
    cy.get('[data-test="login-button"]').click();
  });

  it("navigates to register page", () => {
    cy.get('[data-test="register-link"]').click();
    cy.url().should("include", "/register");
  });
});
