import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Home() {

    const FP = "http://localhost:5000/"

    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [year, setYear] = useState("");
    const [img, setImg] = useState(null);
    const [oldImg, setOldImg] = useState("");
    const [updateImg, setUpdateImg] = useState(null);
    const [AddBookBox, setAddBookBox] = useState(false);
    const [UpdateBookBox, setUpdateBookBox] = useState(false);
    const [updateBookId, setUpdateBookId] = useState("");


    useEffect(() => {
        try {
            const getBoks = async () => {
                const res = await axios.get("http://localhost:5000/");
                setBooks(res.data);
            }
            getBoks();
        } catch (error) {
            console.log(error);
        }

    }, []);

    //update book
    const openUpdateBookBox = (book) => {
        setUpdateBookBox(true);
        setUpdateBookId(book.id);
        setOldImg(book.img);
        setTitle(book.title);
        setAuthor(book.author);
        setYear(book.year);

    }

    const CloseUpdateBox = () => {
        setOldImg("");
        setUpdateBookBox(false);
        setUpdateBookId("");
        setTitle("");
        setAuthor("");
        setYear("");
        setUpdateImg(null);
    }

    // update book
    const updateBook = async (id) => {

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('year', year);
        updateImg && formData.append('files', updateImg);

        setImg(null);
        setUpdateImg(null);
        setTitle("");
        setAuthor("");
        setYear("");
        setUpdateBookId("");
        setUpdateBookBox(false);

        if (updateImg) {
            try {
                const res = await axios.put(`http://localhost:5000/${id}`, formData);
                setBooks(res.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                const res = await axios.put(`http://localhost:5000/${id}`, { title, author, year });
                setBooks(res.data);
            } catch (error) {
                console.log(error);
            }
        }
    }


    //delete book
    const deleteBook = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/${id}`);
            setBooks(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    //open add book box
    const openAddBookBox = () => {
        setAddBookBox(!AddBookBox);
    }

    const CloseAddBox = () => {
        setAddBookBox(false);
        setImg(null);
        setTitle("");
        setAuthor("");
        setYear("");
    }



    // add book
    const addBook = async () => {

        if (title && author && year && img) {

            const formData = new FormData();
            formData.append('title', title);
            formData.append('author', author);
            formData.append('year', year);
            formData.append('files', img);

            setImg(null);
            setTitle("");
            setAuthor("");
            setYear("");
            setAddBookBox(false);

            try {
                const res = await axios.post(`http://localhost:5000/books/insert`, formData);
                setBooks(res.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("please fill all fields");
        }

    }



    return (
        <div className="w-full h-screen relative">
            <div className={`w-full h-20 shadow-md flex justify-center items-center relative`}>
                <h4 className=" text-3xl font-semibold text-gray-600">Books Lists</h4>
                <button onClick={openAddBookBox} className={AddBookBox || UpdateBookBox ? "hidden" : "absolute right-2 top-4 px-4 py-2 bg-blue-500 text-lg font-semibold text-white"}>Add Book</button>
            </div>

            {/* add books */}

            <div className={AddBookBox ? `visible h-4/6 w-2/5 shadow-lg z-10 bg-white absolute transform translate-x-1/2 translate-y-6 right-1/2` : "hidden"}>
                <h4 className="text-center text-lg font-semibold p-3">Add book</h4>
                <div>
                    <input type="text" placeholder="Book Title" value={title} className="w-full p-3 border-b mb-2" onChange={(e) => { setTitle(e.target.value) }} />
                    <input type="text" placeholder="Book Author" value={author} className="w-full p-3 border-b mb-2" onChange={(e) => { setAuthor(e.target.value) }} />
                    <input type="text" placeholder="Book Relese year" value={year} className="w-full p-3 border-b mb-2" onChange={(e) => { setYear(e.target.value) }} />
                    <div className="px-4">
                        <p className=" mb-2">Book Image</p>
                        {
                            img ? <img src={URL.createObjectURL(img)} alt="" className=" w-11" /> : null
                        }
                        <input type="file" onChange={(e) => { setImg(e.target.files[0]) }} className="mt-3" />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button onClick={addBook} className=" font-semibold text-white px-3 py-2 bg-green-600 rounded-2xl">Save Book</button>
                        <button onClick={CloseAddBox} className=" ml-2 font-semibold text-white px-3 py-2 bg-red-600 rounded-2xl">Close</button>
                    </div>
                </div>

            </div>

            {/* add books */}

            {/* update books */}

            <div className={UpdateBookBox ? `visible h-4/6 w-2/5 shadow-lg z-10 bg-white absolute transform translate-x-1/2 translate-y-6 right-1/2` : "hidden"}>
                <h4 className="text-center text-lg font-semibold p-3">Update book</h4>
                <div>
                    <input type="text" placeholder="Book Title" value={title} className="w-full p-3 border-b mb-2" onChange={(e) => { setTitle(e.target.value) }} />
                    <input type="text" placeholder="Book Author" value={author} className="w-full p-3 border-b mb-2" onChange={(e) => { setAuthor(e.target.value) }} />
                    <input type="text" placeholder="Book Relese year" value={year} className="w-full p-3 border-b mb-2" onChange={(e) => { setYear(e.target.value) }} />
                    <div className="px-4">
                        <p className=" mb-2">Book Image</p>
                        {
                            oldImg && !updateImg ? <img src={FP + oldImg} alt="" className=" w-11" /> : null
                        }
                        {
                            updateImg ? <img src={URL.createObjectURL(updateImg)} alt="" className=" w-11" /> : null
                        }
                        <input type="file" onChange={(e) => { setUpdateImg(e.target.files[0]) }} className="mt-3" />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <button onClick={() => updateBook(updateBookId)} className=" font-semibold text-white px-3 py-2 bg-green-600 ">Save Book</button>
                        <button onClick={CloseUpdateBox} className="font-semibold text-white px-3 py-2 bg-red-600 ml-2 ">Close</button>
                    </div>
                </div>

            </div>

            {/* update books */}


            {/* show books */}
            <div className={AddBookBox || UpdateBookBox ? "hidden" : " visible w-3/5 bg-gray-200 mt-7 absolute transform translate-x-2/4 right-1/2"}>

                {
                    books.length > 0 ? books.map((book, index) => {
                        return (
                            <div className=" w-full p-8  h-48 flex justify-between items-center" key={index}>

                                <div className="w-2/6 h-full">
                                    <img src={`${FP}${book.img}`} className=" w-32 h-full" alt="" />
                                </div>
                                <div className="w-3/6 h-full mt-6">
                                    <h2 className="text-xl font-semibold text-gray-600 mb-2">{book.title}</h2>
                                    <h2 className=" text-gray-600 mb-2">Writen By <span className="text-gray-600 font-semibold">{book.author}</span> <span>In {book.year.slice(0, 4)}</span> </h2>
                                </div>
                                <div className="w-1/6">
                                    <button onClick={() => openUpdateBookBox(book)} className="bg-green-600 py-1 px-4 rounded-lg mb-5 text-white hover:bg-green-800 hover:text-gray-300">Eddit</button>
                                    <button onClick={() => deleteBook(book.id)} className=" bg-red-700 py-1 px-4 rounded-lg text-white hover:bg-red-800 hover:text-gray-300">Delete</button>
                                </div>

                            </div>
                        )
                    }) : <div>
                        <p className="p-5 text-center text-lg font-semibold">There is no book</p>
                    </div>
                }

            </div>

            {/* show books */}

        </div>
    )

}



export default Home
