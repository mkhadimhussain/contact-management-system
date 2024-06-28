import inquirer from "inquirer"
import chalk from "chalk"

class Contact {
    private id: number;
    private name: string;
    private phone: number;
    private email: string;

    constructor(id: number, namee: string, phonee: number, emaill: string) {
        this.id = id;
        this.name = namee;
        this.phone = phonee;
        this.email = emaill;
    }
    
    // get() methods return the corresponding property values.
    public getId(): number {
        return this.id;
    }

    // get() methods return the corresponding property values.
    public getName(): string {
        return this.name;
    }

    // set() methods allow updating the corresponding properties.
    public setName(name: string): void {
        this.name = name
    }

    public getPhone(): number {
        return this.phone;
    }

    public setPhone(phone: number): void {
        this.phone = phone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    // Provides a string representation of the Contact object, useful for displaying contact details.
    public toString(): string {
        return chalk.bgCyan.bold(`Contact [Name: ${this.name}, Phone: ${this.phone}, Email: ${this.email}] `);
    }
}

class ContactManager {
    private contacts: Contact[] = [];
    private nextId: number = 1;

    public addContact(name: string, phone: number, email: string): void {
        const contact = new Contact(this.nextId++, name, phone, email);
        this.contacts.push(contact);
    }

    public getContact(id: number): Contact | undefined {
        return this.contacts.find(contact => contact.getId() === id);
    }

    public getAllContacts(): Contact[] {
        return this.contacts;
    }

    public removeContact(id: number): boolean {
        const index = this.contacts.findIndex(contact => contact.getId() === id);
        if (index !== -1) {
            this.contacts.splice(index, 1);
            return true;
        }
        return false;
    }

    public updateContact(id: number, name?: string, phone?: number, email?: string): boolean {
        const contact = this.getContact(id);
        if (contact) {
            if (name !== undefined) contact.setName(name);
            if (phone !== undefined) contact.setPhone(phone);
            if (email !== undefined) contact.setEmail(email);
            return true;
        }
        return false;
    }

    public toString(): string {
        return this.contacts.map(contact => contact.toString()).join('\n');
    }
}

// Create an instance of ContactManager
const manager = new ContactManager();

// Function to display the main menu
async function mainMenu() {
    const answers = await inquirer.prompt(
        [
            {
                name: "action",
                message: chalk.bgBlue.bold("\nWhat do you want to do?"),
                type: "list",
                choices: [
                    "Add Contact",
                    "View All Contacts",
                    "Update Contact",
                    "Remove Contact",
                    "Exit"
                ]
            }
        ]
    );

    switch (answers.action) {
        case "Add Contact":
            await addContact();
            break;
        case "View All Contacts":
            viewAllContact();
            break;
        case "Update Contact":
            await updateContact();
            break;
        case "Remove Contact":
            await removeContact();
            break;
        case "Exit":
            console.log(chalk.bgGreen.bold("Goodbye!"));
            return;
    }

    await mainMenu();
}

// Function to add a contact
async function addContact() {
    const answers = await inquirer.prompt(
        [
            {name: "name", message: chalk.bgCyan.bold("Enter Name:"), type: "input"},
            {name: "phone", message: chalk.bgCyan.bold("Enter Phone number:"), type: "input"},
            {name: "email", message: chalk.bgCyan.bold("Enter email:"), type: "input"}
        ]
    );

    manager.addContact(answers.name, answers.phone, answers.email);
    console.log(chalk.bgGreen.bold("\nContact Added Succussfully."));
    
}

// Function to view all contacts
function viewAllContact() {
    console.log(chalk.bgGreen.bold("\nAll Contacts:\n"));
    console.log(manager.toString());    
}

// Function to update a contact
async function updateContact() {
    const {id} = await inquirer.prompt(
        [
            {name: "id", message: chalk.bgCyan.bold("\nEnter the ID of the Contact to update:"), type: "input"}
        ]
    );

    const contact = manager.getContact(Number(id));
    if (!contact) {
        console.log(chalk.bgRed.bold("\nContact not found"));
        return;
    }

    const answers = await inquirer.prompt([
        {name: "name", message: chalk.bgCyan.bold(`\nEnter new Name (${contact.getName()})`), type: "input"},
        {name: "phone", message: chalk.bgCyan.bold(`\nEnter new Phone number (${contact.getPhone()})`), type: "input"},
        {name: "email", message: chalk.bgCyan.bold(`\nEnter new Email (${contact.getEmail()})`), type: "input"}
    ]);

    manager.updateContact(Number(id), answers.name || undefined, answers.phone || undefined, answers.email || undefined);
    console.log(chalk.bgGreen.bold("\nContact Updated Successfully."));
}

// Function to remove a contact
async function removeContact() {
    const {id} = await inquirer.prompt([
        {name: "id", message: chalk.bgCyan.bold("\nEnter the ID of the Contact to remove:"), type: "input"}
    ]);

    if (manager.removeContact(Number(id))) {
        console.log(chalk.bgGreen.bold("\nContact Removed Successfully."));
    } else {
        console.log(chalk.bgRed.bold("\nContact not found"));
    }
}

// Start the main menu
mainMenu();
