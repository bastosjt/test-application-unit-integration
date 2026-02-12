const User = require('./user');
const Item = require('./item');
const Todolist = require('./todolist');

// TEST USER

describe('User', () => {

    describe('Password validation', () => {

        test('Invalid : password too short', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "pass");
            expect(user.isPasswordValid()).toBe(false);
        });

        test('Invalid : password too long', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password12345678901234567890123456789051856151631654311548651568613532165481234567890");
            expect(user.isPasswordValid()).toBe(false);
        });

        test('Valid password', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password123");
            expect(user.isPasswordValid()).toBe(true);
        });

    });

    describe('Age validation', () => {

        test('Invalid : Age too young', async () => {
            const user = new User("JAMET", "Bastien", "2020-01-01", "bastien.jamet@gmail.com", "Password123");
            expect(user.getAge()).toBeLessThan(13);
        });

        test('Valid Age', () => {
            const user = new User('Doe', 'John', '2000-01-01', 'john@example.com', 'ValidPass123');
            expect(user.getAge()).toBeGreaterThan(13);
        });

    });

    describe('Email validation', () => {

        test('Invalid : mail without @', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jametgmail.com", "Password123");
            expect(user.validateEmailBasic()).toBe(false);
        });

        test('Invalid : mail without domain', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail", "Password123");
            expect(user.validateEmailBasic()).toBe(false);
        });

        test('Valid mail ', () => {
            const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password123");
            expect(user.validateEmailBasic()).toBe(true);
        });

    });

});

// TEST ITEM

describe('Item', () => {

    describe('Content validation', () => {

        test('Invalid : content too long', () => {
            const longContent = 'a'.repeat(1001);
            const item = new Item('Test Item', longContent);
            expect(item.isValid()).toBe(false);
        });

        test('Invalid : empty content', () => {
            const item = new Item('Test Item', '');
            expect(item.isValid()).toBe(false);
        });

        test('Valid content', () => {
            const content = 'a'.repeat(1000);
            const item = new Item('Test Item', content);
            expect(item.isValid()).toBe(true);
        });

    });

    describe('Name validation', () => {

        test('should reject empty name', () => {
            const item = new Item('', 'Valid content');
            expect(item.isValid()).toBe(false);
        });

        test('should reject name with only spaces', () => {
            const item = new Item('   ', 'Valid content');
            expect(item.isValid()).toBe(false);
        });

        test('should reject null name', () => {
            const item = new Item(null, 'Valid content');
            expect(item.isValid()).toBe(false);
        });

        test('should reject name longer than 1000 characters', () => {
            const longName = 'a'.repeat(1001);
            const item = new Item(longName, 'Valid content');
            expect(item.isValid()).toBe(false);
        });

        test('should accept valid name', () => {
            const item = new Item('Valid Name', 'Valid content');
            expect(item.isValid()).toBe(true);
        });

    });

});

// TESTS TODOLIST

describe('Todolist', () => {

    let user, emailService, todolist;

    beforeEach(() => {
        user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password123");
        user.validateEmailExternal = jest.fn().mockResolvedValue(true);
        emailService = { sendEmail: jest.fn() };
        todolist = new Todolist(user, emailService);
        todolist.save = jest.fn();
    });

    test('Valid item', async () => {
        const item = new Item('Item 1', 'Content 1');
        await todolist.add(item);
        expect(todolist.items.length).toBe(1);
    });

    test('Error : adding 11th item', async () => {
        for (let i = 1; i <= 10; i++) {
            const item = new Item(`Item ${i}`, `Content ${i}`);
            item.creationDate = new Date(Date.now() - i * 1800001);
            todolist.items.push(item);
        }
        await expect(todolist.add(new Item('Item 11', 'Content'))).rejects.toThrow('Todolist pleine');
    });

    test('Error : adding item before 30 minutes', async () => {
        const item1 = new Item('Item 1', 'Content 1');
        item1.creationDate = new Date(Date.now() - 60000);
        todolist.items.push(item1);
        await expect(todolist.add(new Item('Item 2', 'Content 2'))).rejects.toThrow('Vous devez attendre');
    });

    test('Valid item : email sent with 8th item', async () => {
        for (let i = 1; i <= 7; i++) {
            const item = new Item(`Item ${i}`, `Content ${i}`);
            item.creationDate = new Date(Date.now() - i * 1800001);
            todolist.items.push(item);
        }
        await todolist.add(new Item('Item 8', 'Content 8'));
        expect(emailService.sendEmail).toHaveBeenCalledWith(
            user.mail,
            'TodoList presque pleine',
            expect.any(String)
        );
    });

    test('Valid item', async () => {
        const item = new Item('Item 1', 'Content 1');
        await todolist.add(item);
        expect(todolist.save).toHaveBeenCalledWith(item);
    });

});