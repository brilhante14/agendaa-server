const { Comment, TurmasInfo } = require("../models/turmasInfo");
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

const commentData = {
    text: "Testando comentário"
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


describe('Gerenciar comentários', () => {
    it('Deve ser possível criar um comentário', async () => {
        const validComment = new Comment(commentData);
        const savedComment = await validComment.save();

        expect(savedComment.text).toBe(commentData.text);
    });

    it('Deve ser possível responder a um comentário', async () => {
        const validComment = new Comment(commentData);
        validComment.replies.push({ text: "Resposta" });
        const savedComment = await validComment.save();

        expect(savedComment.replies[0].text).toBe("Resposta");
    });

    it('Deve ser possível remover um comentário', async () => {
        const validComment = new Comment(commentData);
        const savedComment = await validComment.save();
        await Comment.findByIdAndDelete(savedComment._id);

        const comments = await Comment.find();


        expect(comments).toHaveLength(0);
    });

    it('Deve ser possível editar um comentário', async () => {
        const validComment = new Comment(commentData);
        const savedComment = await validComment.save();

        expect(savedComment.text).toBe("Testando comentário");

        const editedComment = await Comment.findByIdAndUpdate(savedComment._id, { text: "Testando edição" }, { new: true });

        expect(editedComment.text).toBe("Testando edição");
    });

    it('Deve ser possível remover um participante de uma turma', async () => {
        const validComment = new Comment(commentData);
        validComment.replies.push({ text: "Resposta" });
        const savedComment = await validComment.save();

        expect(savedComment.replies[0].text).toBe("Resposta");

        const replyId = savedComment.replies[0]._id;
        validComment.replies.pull({ text: "Resposta" });
        await validComment.save();

        expect(savedComment.replies).toHaveLength(0);
    });
});