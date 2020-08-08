/// <reference types="cypress" />

let Chance = require("chance");
let chance = new Chance();

context('Cadastro', () => {
    it('Cadastro de usuário no site', () => {
        //rotas
        cy.server();
        cy.route("POST", "**/api/1/databases/userdetails/collections/newtable?**").as('postNewTable');
        cy.route('POST', '**/api/1/databases/userdetails/collections/usertable?**').as('postUserTable');
        cy.route('GET', '**/api/1/databases/userdetails/collections/newtable?**').as('getNewTable');
        // baseUrl + Register.html
        cy.visit('Register.html');

        //type
        cy.get('input[placeholder="First Name"]').type(chance.first());
        cy.get('input[ng-model^=Last]').type(chance.last());
        cy.get('input[ng-model^=Email]').type(chance.email());
        cy.get('input[ng-model^=Phone]').type(chance.phone({ formatted: false }));

        //check -> radios e checkboxes
        cy.get("input[value=FeMale]").check();
        cy.get("input[type=checkbox]").check("Cricket");
        cy.get("input[type=checkbox]").check("Hockey");

        // select -> select $ select2 (combos)
        cy.get("select#Skills").select("Javascript");
        cy.get("select#countries").select("Argentina");
        cy.get("select#country").select("Australia", { force: true });
        cy.get("select#yearbox").select("1996");
        cy.get("select[ng-model^=month]").select("February");
        cy.get("select#daybox").select("24");

        cy.get("input#firstpassword").type("Agilizei@2020");
        cy.get("input#secondpassword").type("Agilizei@2020");

        // attachFile -> input file
        cy.get("input#imagesrc").attachFile("photo.jpg");

        // click
        cy.get("button#submitbtn").click();

        cy.wait("@postNewTable").then((resNewTable) => {
            // cy.log(resNewTable.status)
            // chai
            expect(resNewTable.status).to.eq(200);
        })

        cy.wait("@postUserTable").then((resUserTable) => {
            expect(resUserTable.status).to.eq(200);
        })

        cy.wait("@getNewTable").then((resGetNewTable) => {
            expect(resGetNewTable.status).to.eq(200);
        })

        cy.url().should("contain", "WebTable");
    });
});