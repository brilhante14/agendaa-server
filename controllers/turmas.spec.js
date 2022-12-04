const { TurmasInfo } = require("../models/turmasInfo");
const { User } = require("../models/user");

const db = require("./db");
const { default: mongoose } = require("mongoose");

const userData = {
    user: "testTurma",
    email: "testTurma@email.com",
    password: "senha",
    nome: "Test Turma",
    role: "aluno"
};

const turmaData = {
    nome: "Verificação e Validação de Software",
    inicio: new Date(),
    fim: new Date(),
}

beforeAll(async () => {
    await db.setUp();
});

afterEach(async () => {
    await db.dropCollections();
});

afterAll(async () => {
    await db.dropDatabase();
});


describe('Gerenciar turmas', () => {
    it('Deve ser possível criar uma turma', async () => {
        const validTurma = new TurmasInfo(turmaData);
        const savedTurma = await validTurma.save();

        expect(savedTurma.nome).toBe(turmaData.nome);
    });

    it('Deve ser possível editar uma turma', async () => {
        const validTurma = new TurmasInfo(turmaData);
        await validTurma.save();

        const turmaEdited = await TurmasInfo.findByIdAndUpdate(validTurma._id, {
            nome: "Test Edition",
        }, { new: true });

        expect(turmaEdited.nome).toBe("Test Edition");
    });

    it('Deve ser possível finalizar uma turma', async () => {
        const validTurma = new TurmasInfo(turmaData);
        await validTurma.save();

        const turmaEdited = await TurmasInfo.findByIdAndUpdate(validTurma._id, {
            isFinished: true,
        }, { new: true });

        expect(turmaEdited.isFinished).toBeTruthy();
    });

    it('Deve ser possível adicionar um participante a uma turma', async () => {
        const validUser = new User(userData);
        const user = await validUser.save();

        const validTurma = new TurmasInfo(turmaData);
        validTurma.participantes.push(user);

        const turma = await validTurma.save();

        expect(turma.participantes).toHaveLength(1);
        expect(turma.participantes[0].nome).toBe("Test Turma");
    });

    it('Deve ser possível remover um participante de uma turma', async () => {
        const validUser = new User(userData);
        const user = await validUser.save();

        const validTurma = new TurmasInfo(turmaData);
        validTurma.participantes.push(user);
        const turma = await validTurma.save();

        expect(turma.participantes).toHaveLength(1);
        expect(turma.participantes[0].nome).toBe("Test Turma");

        validTurma.participantes.pull(user);
        await validTurma.save();

        expect(turma.participantes).toHaveLength(0);
    });
});