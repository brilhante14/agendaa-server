const { User } = require("../models/user");

const { MongoError } = require("mongodb");

const db = require("./db");
const { default: mongoose } = require("mongoose");

const userData = {
    user: "testCreation",
    email: "testCreation@email.com",
    password: "senha",
    nome: "Test Creation",
    role: "aluno"
};

beforeAll(async () => {
    await db.setUp();
});

afterEach(async () => {
    await db.dropCollections();
});

afterAll(async () => {
    await db.dropDatabase();
});


describe('Gerenciar usuários', () => {
    it('Deve ser possível criar um usuário aluno', async () => {
        const validUser = new User(userData);
        const savedUser = await validUser.save();

        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.phone).toBe(userData.phone);
    });

    it('Não deve ser possível criar um usuário aluno sem os campos obrigatórios', async () => {
        const validUser = new User({ nome: "Nome teste " });

        let err;
        try {
            await validUser.save();
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.email).toBeDefined();
    });

    it('Não deve ser possível criar um usuário aluno com username já existente', async () => {
        const validUser = new User({ ...userData, user: 'TestRepeatedName' });
        const repeatedUser = new User({ ...userData, user: 'TestRepeatedName' });

        let err;
        try {
            await validUser.save();
            await repeatedUser.save();
            const getUsers = await User.find();
            console.log(getUsers);
        } catch (error) {
            err = error;
        }

        expect(err).toBeInstanceOf(MongoError);
        expect(err.message).toMatch("duplicate key error");
    });

    it('Deve ser possível achar um usuário aluno após sua criação', async () => {
        const validUser = new User(userData);
        await validUser.save();

        const getUsers = await User.find();

        expect(getUsers[0].email).toBe(userData.email);
        expect(getUsers[0].nome).toBe(userData.nome);
    });

    it('Deve ser possível editar um usuário', async () => {
        const validUser = new User(userData);
        await validUser.save();
        const userEdited = await User.findByIdAndUpdate(validUser._id, {
            nome: "Test Edition",
        }, { new: true });

        expect(userEdited.email).toBe(userData.email);
        expect(userEdited.nome).toBe("Test Edition");
    });
});