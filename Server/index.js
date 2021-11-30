const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer')
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/upload")))

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '25524',
    database: 'saykot'
});

connection.connect((err) => {

    if (err) throw err;
    console.log('Connected to MySQL Server!');
});


// multer images upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },

    filename: (req, file, cb) => {
        cb(null, + Date.now() + "-" + file.originalname)
    }
})

const upload = multer({

    storage: storage, fileFilter: (req, file, cb) => {
        if (
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/png"
        ) {
            cb(null, true)
        } else {
            cb(new Error("only jpg,jpeg and png are alowed."))
        }

    }
})


// get all books
app.get("/", (req, res) => {

    try {
        connection.query('SELECT * from BookList', (err, rows) => {
            if (err) throw err;
            res.status(200).json(rows);
        });

    } catch (error) {

        res.status(400).json({ message: error.message });
    }
});

// get book by id
app.get("/:id", (req, res) => {

    try {

        connection.query('SELECT * from BookList where id = ?', [req.params.id], (err, rows) => {
            if (err) throw err;
            console.log('The data from BookList table are: \n', rows);
            res.status(200).json(rows);
        });

    } catch (error) {

        res.status(400).json({ message: error.message });
    }
});


// insert a book
app.post("/books/insert", upload.single('files'), (req, res) => {

    const book = {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year,
        img: req.file.filename
    };

    if (book) {
        try {
            connection.query('INSERT INTO BookList SET ?', book, (err, result) => {
                if (err) throw err;

                connection.query('SELECT * from BookList', (err, rows) => {
                    if (err) throw err;
                    res.status(200).json(rows);
                });
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
            console.log(error);
        }
    } else {
        res.status(400).json({ message: "Please fill all the fields" });
    }
});

// update a book
app.put("/:id", upload.single('files'), (req, res) => {

    try {

        if (req.file) {

            const filesquery = `UPDATE BookList SET title = ?, author = ?, year = ?, img = ? WHERE id = ?`;
            const filesvalues = [req.body.title, req.body.author, req.body.year, req.file.filename, req.params.id];

            connection.query(filesquery, filesvalues, (err, result) => {

                if (err) throw err;

                connection.query('SELECT * from BookList', (err, rows) => {
                    if (err) throw err;
                    res.status(200).json(rows);
                });
            });

        } else {

            const query = `UPDATE BookList SET title = ?, author = ?, year = ? WHERE id = ?`;
            const values = [req.body.title, req.body.author, req.body.year, req.params.id];

            connection.query(query, values, (err, result) => {

                if (err) throw err;

                connection.query('SELECT * from BookList', (err, rows) => {
                    if (err) throw err;
                    res.status(200).json(rows);
                });
            });

        }

    } catch (error) {

        res.status(400).json({ message: error.message });
    }
});

// delete a book
app.delete("/:id", (req, res) => {

    try {

        connection.query('DELETE FROM BookList WHERE id = ?', [req.params.id], (err, result) => {
            if (err) throw err;

            connection.query('SELECT * from BookList', (err, rows) => {
                if (err) throw err;
                res.status(200).json(rows);
            });
        });

    } catch (error) {

        res.status(400).json({ message: error.message });
    }
});


app.listen(5000, () => {
    console.log('Server is running at port 5000');
});