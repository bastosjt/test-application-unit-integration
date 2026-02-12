const User = require('./user');

test('User - Valid user', async () => {
    const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password123");
    expect(await user.isValid()).toBe(true);
});

test('User - Age under 13', async () => {
    const user = new User("JAMET", "Bastien", "2020-01-01", "bastien.jamet@gmail.com", "Password123");
    expect(await user.isValid()).toBe(false);
});

test('User - Empty nom', async () => {
    const user = new User("", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "Password123");
    expect(await user.isValid()).toBe(false);
});

test('User - Invalid Password', async () => {
    const user = new User("JAMET", "Bastien", "2004-05-23", "bastien.jamet@gmail.com", "pass");
    expect(await user.isValid()).toBe(false);
});