import { useEffect, useRef, useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css';

// Showing the retrieved information
function Output(props){
  return(
    <>
    <div className='m-5 row'>
      <div className='row justify-content-center align-items-center'>
      <img src={props.src} style={{width:"250px",height:"auto"}}></img>
      </div>
      
      <p className='h1 bold mt-3 row justify-content-center'>{props.count}</p>
      <p className='h2 mt-3 row justify-content-center'>{props.author}</p>
      <p className='h5 mt-3 row justify-content-center'>Published on:&nbsp;{props.year}</p>
      <p className='h6 mt-3 row justify-content-center'>Currently reading:{props.format}&nbsp;|&nbsp;ISBN:&nbsp;{props.isbn}</p>
      <p className='h6 mt-3 row justify-content-center'>Characters:{props.person}</p>
      <p className='h6 mt-3 row justify-content-center'>Place:{props.place}</p>
    </div>
    </>
  )
}

// Search Books
function SearchBar({sendData}){
  const myRef = useRef('');
  function handleClick(){
    sendData(myRef.current.value);
  }

  return(
    <>
    <div className='d-flex justify-content-center gap-4 m-5 '>
    <input type='text' ref={myRef} className=''></input>
    <button onClick={handleClick}>Search</button>
    </div>
    </>
  )
}


// Title of the Page
function Header(props){
return <h1 className='h1 text-center'>{props.heading}</h1>
}


// Main Logic of the page 
function App() {
  const [count, setCount] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [bookImg, setBookImg] = useState('./public/book.svg');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('');
  const [person, setPerson] = useState('');
  const [place, setPlace] = useState('');
  const [dataFromChild,setDataFromChild] = useState('');
  function handleData(data){

    setDataFromChild(data);
  }
useEffect(() =>{

  const fetchData = async () =>{
    try{
      const res1 = await fetch(`https://openlibrary.org/search.json?q=${dataFromChild}`);

      if(!res1.ok){
        throw new Error("Failed to fetch first data");
      }
      const data1 = await res1.json();
      console.log(data1,data1.docs[0].isbn[1])
      setIsbn(data1.docs[0].isbn[0]?isbn[0]:isbn[1]);
      setCount(data1.docs[0].title);        // Storing it in variable
      setAuthor(data1.docs[0].author_name[0]);
      setYear(data1.docs[0].first_publish_year);
      setPerson(data1.docs[0].person);
      setPlace(data1.docs[0].place);
      setFormat(data1.docs[0].currently_reading_count);
      
      const isbnVal = data1.docs[0].isbn[0];

      const res2 = await fetch(`https://covers.openlibrary.org/b/isbn/${isbnVal}-L.jpg`);

      if(!res2.ok){
        throw new Error("Failed to fetch first data");
      }

      const data2 = await res2.blob();
      const imgURL = URL.createObjectURL(data2);
      setBookImg(imgURL? imgURL: './public/book.svg');
    } catch(err){
      console.log(err);
    }
  }

  fetchData();

  // Fetching image and other data from API


},[dataFromChild])

  return (
    <>
      <Header heading={"KNOWBOOKS"} />
      <SearchBar sendData={handleData}/>
      <Output count={count} author={author} src={bookImg} year={year} format={format} isbn={isbn} person={person} place={place}/>  
    </>
  )
}

export default App
