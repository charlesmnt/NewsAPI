import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [ListWish, setListWish] = useState([])
  const [test, setTest] = useState('')


  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var noArticles
  if(props.myArticles == 0){
    noArticles = <div style={{marginTop:"30px"}}>No Articles</div>
  }
  

  var deleteWishToDataBase = async (article) => {
    var token = props.token;
    
    const data = await fetch('/deleteWishes/', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `tokenFromFront=${token}&title=${article.title}`
    })
    props.deleteToWishList(article)
    setTest(props.deleteToWishList(article))
  }

  useEffect(() => {
    var getWishToDataBase = async () => {
      var token = props.token;
      
      const data = await fetch(`/getWishes/${token}`)
      const answer = await data.json()

      setListWish([...answer])
    }
    getWishToDataBase()    
  },[])
  
  console.log(ListWish)

  return (
    <div>
         
            <Nav/>

            <div className="Banner"/>

            {noArticles}

            <div className="Card">
    

            {ListWish.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                  <Card
                    
                    style={{ 
                    width: 300, 
                    margin:'15px', 
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.image}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => deleteWishToDataBase(article)} />
                    ]}
                    >

                    <Meta
                      title={article.title}
                      description={article.content}
                    />

                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>

                </div>

              ))}



       

                

             </div>
      
 

      </div>
  );
}

function mapStateToProps(state){
  return {myArticles: state.wishList, token : state.token}
}

function mapDispatchToProps(dispatch){
  return {
    deleteToWishList: function(articleTitle){
      console.log(articleTitle)
      dispatch({type: 'deleteArticle',
        title: articleTitle
      })
    }
  }
}



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
