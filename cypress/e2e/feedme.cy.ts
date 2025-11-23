describe('FeedMe Order System', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('creates a normal order and displays it in pending list', () => {
    // Click New Normal Order button
    cy.contains('button', 'New Normal Order').click()
    
    // Fill in customer name
    cy.get('input[id="name"]').type('John Doe')
    
    // Select menu items
    cy.contains('label', 'Burger').click()
    cy.contains('label', 'Fries').click()
    
    // Submit the order
    cy.contains('button', 'Submit Order').click()
    
    // Verify order appears in pending list
    cy.contains('PENDING').should('be.visible')
    cy.contains('John Doe').should('be.visible')
    cy.contains('Burger, Fries').should('be.visible')
  })

  it('creates VIP order and shows VIP badge', () => {
    // Click New VIP Order button
    cy.contains('button', 'New VIP Order').click()
    
    // Fill in customer name
    cy.get('input[id="name"]').type('VIP Customer')
    
    // Select menu item
    cy.contains('label', 'Fried Chicken').click()
    
    // Submit the order
    cy.contains('button', 'Submit Order').click()
    
    // Verify VIP order appears with VIP badge
    cy.contains('VIP Customer').should('be.visible')
    cy.contains('VIP').should('be.visible')
  })

  it('adds and removes bots', () => {
    // Add a bot
    cy.contains('button', '+ Bot').click()
    
    // Verify bot appears
    cy.contains('Bot 1').should('be.visible')
    cy.contains('IDLE').should('be.visible')
    
    // Add another bot
    cy.contains('button', '+ Bot').click()
    cy.contains('Bot 2').should('be.visible')
    
    // Remove a bot
    cy.contains('button', '- Bot').click()
    
    // Verify only one bot remains
    cy.contains('Bot 1').should('be.visible')
    cy.contains('Bot 2').should('not.exist')
  })

  it('processes order when bot is added', () => {
    // Create an order first
    cy.contains('button', 'New Normal Order').click()
    cy.get('input[id="name"]').type('Test Customer')
    cy.contains('label', 'Burger').click()
    cy.contains('button', 'Submit Order').click()
    
    // Verify order is in pending
    cy.contains('Test Customer').should('be.visible')
    
    // Add a bot
    cy.contains('button', '+ Bot').click()
    
    // Verify bot starts processing (shows countdown)
    cy.contains('Cooking #1').should('be.visible')
    cy.contains(/\d+s/).should('be.visible') // Matches any number followed by 's'
  })
})
