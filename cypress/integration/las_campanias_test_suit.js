describe('Las Campanias Test Suit', function() {
  it('Visits the home page', function() {
    cy.visit('/')
    cy.contains('Bienvenidos')
  })

  it('Asks for log-in when using the site', function() {
    cy.visit('/')
    cy.contains('Contactos').click()
    cy.get('input:text')
    cy.get('input:password')
    cy.get('input:submit')
    cy.contains('Campañas').click()
    cy.get('input:text')
    cy.get('input:password')
    cy.get('input:submit')
  })

  it('Successfully creates an user and login', function() {
    cy.visit('/')
    // creates user
    cy.contains('Sign In').click()
    cy.get('input:text').type('testinguser')
    cy.get('input:password:first').type('test')
    cy.get('input:password:last').type('test')
    cy.get('input:submit').click()
    // login
    cy.get('input:text').type('testinguser')
    cy.get('input:password:first').type('test')
    cy.get('input:submit').click()

    cy.contains('Nuevo Contacto')
  })

  it('Creates a Contact', function() {
    cy.visit('/')

    var id = Date.now()
    // login
    cy.contains('Log in').click()
    cy.get('input:text').type('testinguser')
    cy.get('input:password:first').type('test')
    cy.get('input:submit').click()

    // complete form
    cy.get('input[name=contactName]').type('Mario' + id)
    cy.get('input[name=contactEmail]').type('m'+ id + '@bross.com')
    cy.get('input[name=contactPhoneNumber]').type(id)
    cy.get('input[name=contactTags]').type('test, user')
    cy.get('input:submit').click()

    cy.contains('Mario'+id)
  })

  it('Log Out current user', function() {
    cy.visit('/')
    cy.contains('Bienvenidos')
    // login
    cy.contains('Log in').click()
    cy.get('input:text').type('testinguser')
    cy.get('input:password:first').type('test')
    cy.get('input:submit').click()
    // logout
    cy.contains('Log Out').click()
    cy.contains('Bienvenidos')
  })

  // it('Creates a Campaign', function() {
    // cy.visit('/')
    //
    // var id = Date.now()
    // // login
    //
    // cy.contains('Log in').click()
    // cy.get('input:text').type('testinguser')
    // cy.get('input:password:first').type('test')
    // cy.get('input:submit').click()
    //
    // cy.contains('Campañas').click()
    // // complete form
    // cy.get('input[name=campaignTitle]').type('Campania ' + id)
    // cy.get('input[name=campaignEmail]').type('sender'+ id + '@bross.com')
    // cy.get('input[name=campaignSubject]').type('asunto ' + id)
    //
    // cy.get('.Select-placeholder').click()
    // cy.get('.Select-placeholder').type('testuser')
    // cy.get('.Select-input input[role=combobox]').invoke('attr', 'value', 'testuser')
    // cy.get('.Select-input div').invoke('html', 'testuser')
    // cy.get('.Select-input input[role=combobox]').invoke('change')

    // cy.get('span[data-text=true]:first').type('Este es el cuerpo del mensaje')
    // cy.contains('Mario'+id)
  // })
})

