describe('Dev Portal', () => {
    it('It Loads', () => {
        cy.visit('/')
        cy.get('button').contains('Login')
    });
})