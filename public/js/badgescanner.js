var gUM=false;
var db = null;
var lastvcard = null;

var initCanvas = function (w,h) {
  var gCanvas = document.getElementById("qr-canvas");
  gCanvas.style.width = w + "px";
  gCanvas.style.height = h + "px";
  gCanvas.width = w;
  gCanvas.height = h;
  var gCtx = gCanvas.getContext("2d");
  gCtx.clearRect(0, 0, w, h);
};

var success = function(stream) {
  var v=document.getElementById("v");
  v.src = window.URL.createObjectURL(stream);
  gUM=true;
};


//function myFunction(){
  //var v1 = document.getElementById("v1");
//  v1.src = "";
//document.getElementById("1.mp4").src="../media/1.mp4";
//document.getElementById("v1").load();
//}



var error = function(e) {
  gUM=false;
  return;
};

var captureToCanvas = function() {
  if (gUM) {
    try {
      document.getElementById("qr-canvas").getContext("2d").drawImage(v,0,0);
      qrcode.decode();
    } catch(e) {
    };
  }
};

var simplify = function(x) {
  if (!x) {
    return null;
  }
  var y = [];
  for(var i in x) {
    if (x[i].value) {
      y.push(x[i].value);
    }
  }
  return y.join(",");
}


var createDatabase = function(callback) {
 db = new PouchDB("badgescanner");
 var ddoc = {
   _id: '_design/query',
   views: {
     byts: {
       map: function (doc) {
         if (typeof doc.ts != "number") {
           doc.ts = 0;
         }
         emit(doc.ts,null);
       }.toString()
     }
   }
 };

 db.put(ddoc).then(function (data) {
   callback(null, data);
 }).catch(function (err) {
   callback(null, null);
 });
}

/*db.query("query/byts", {descending:true, include_docs:true} ).then(function (result) {
  for(var i in result.rows) {
    var d = result.rows[i].doc;
    if (d) {

      var data = d.url;

var play = function(data){

  var v1 = document.getElementById("v1");
  v1.src = "data";

}
}

}*/
//var videoElement = document.getElementById('v1');
    //videoElement.pause();
    //videoElement.src =""; // empty source
   //videoElement.load();

var renderTable = function() {
  var fn = function(doc) {
    if (typeof doc.ts == "number") {
      emit(doc.ts,null);
    }
  };
  document.getElementById("v1").removeAttribute('src');
  db.query("query/byts", {descending:true, include_docs:true} ).then(function (result) {
    if(result.rows.length>0) {
      var html = '<table class="primary">';
      html += '<thead><tr>';
      html += '<th>fn</th>';
      html += '<th>title</th>';
      html += '<th>org</th>';
      html += '<th>tel</th>';
      html += '<th>email</th>';
      html += '<th>url</th>';
      html += '<th>note</th>';
      html += '</tr></thead>';
      html += '<tbody>';
      for(var i in result.rows) {
        var d = result.rows[i].doc;
        if (d) {
          html += '<tr>';
          html += '<td>' + d.fn + '</td>';
          html += '<td>' + d.title + '</td>';
          html += '<td>' + d.org + '</td>';
          html += '<td>' + d.tel + '</td>';
          html += '<td>' + d.email + '</td>';
          html += '<td>' + d.url + '</td>';

          //document.getElementById("v1").src="";


         var data = d.url;

         var vdo = document.getElementById("v1");
        // if(data==='../media/1.mp4'){
           vdo.src=data;
         //}
         //else if (data==='../media/2.mp4') {
           //document.getElementById("v22").src="../media/2.mp4";
         //}
         //else {
           //document.getElementById("v33").src="../media/3.mp4";
         //}

         //var val = document.getElementById("v1");
         //val.removeAttribute('src');
         //val.load();

         //document.getElementById("v1").load();

         //document.getElementById("v1").load();
          //document.getElementById("v1").src= data;
          //data = null;
          //document.getElementById("v22").src=data;
          //document.getElementById("v33").src=date;
          //document.getElementById(v.src=../media/1.mp4)
          //document.getElementById("v1").src="../media/1.mp4";
          html += '<td><label for="modal_2" class="button notebutton" data-id="' + d._id + '" data-rev="' + d._rev + '">Note</label></td>';
          html += '</tr>';
          //function myFunction(data){
            //var v1 = document.getElementById("v1");
            //v1.src = "data";
          //document.getElementById("1.mp4").src="../media/1.mp4";
          //document.getElementById("v1").load();
          //}
        }
      }
      html += '</tbody></table>';
    } else {
      html = "";
      vdo.src="";
    }

    //var videoElement = document.getElementById('v1');
      //  videoElement.pause();
        //videoElement.src =""; // empty source
       //videoElement.load();

    document.getElementById("thetable").innerHTML=html;


    $('.notebutton').bind("click", function(event) {
      var b = $( this );
      var id = b.attr("data-id");
      var rev = b.attr("data-rev");
      $('#noteid').val(id);
      $('#noterev').val(rev);
      $('#notetxt').val("");
      db.get(id, function(err, data) {
        if (data && data.note) {
          $('#notetxt').val(data.note);
        }
      });
    });

    // handle result
  }).catch(function (err) {
    console.log("query error",err);
  });
};

var saveNote = function() {
  var id = $('#noteid').val();
  var note = $('#notetxt').val();
  db.get(id, function(err, data) {
    if(!err) {
      data.note = note.replace(/\r/g," ").replace(/\n/g," ");
      db.put(data);
    }
  });
}

var replicate = function() {
  document.getElementById("replicationstatus").innerHTML="";
  var url = document.getElementById("url").value;
  if(url) {
    var remoteDB = new PouchDB(url);
    db.replicate.to(remoteDB)
      .on("change", function(info) {
        document.getElementById("replicationstatus").innerHTML = "IN PROGRESS - " + info.docs_written;
      })
      .on("complete", function(info) {
        document.getElementById("replicationstatus").innerHTML = "COMPLETE - " + info.docs_written;
      })
      .on("error",  function(err) {
        document.getElementById("replicationstatus").innerHTML = "ERROR - " + JSON.strinfify(err);
      });
  }
};

// called when a qrcode is detected
qrcode.callback = function(data) {
  console.log(data);

  // create vcard object
  var vcard = vcardParse(data);
  if (!vcard) {
    // if we got here, then "data" isn't a vcard
    if (lastvcard && lastvcard == data) {
      console.log("rejected - we just had that one", data);
      return;
    }
    vcard = { url: data};
    lastvcard = data;
  } else {
    if (lastvcard && vcard.fn == lastvcard.fn) {
      console.log("rejected - we just had that one", vcard.fn);
      return;
    }
    vcard.tel = simplify(vcard.tel);
    vcard.email = simplify(vcard.email);
    vcard.adr = simplify(vcard.adr);
    lastvcard = vcard;
  }

  // add timestampss
  var d = new Date();
  vcard.ts = d.getTime();
  vcard.date = d.toISOString();
  console.log("accepted", JSON.stringify(vcard));

  // play audio
  var myAudio = document.getElementById("beep");
  myAudio.play();

  // saved to database
  db.post(vcard).then(function (response) {

    // update UI
    renderTable();

  }).catch(function (err) {
    console.log(err);
  });
};

// delete all data
var deleteData = function() {
  db.destroy().then(function (response) {
    createDatabase(function() {
      renderTable();
    })
  });
}

window.addEventListener("DOMContentLoaded", function() {

  // create database and design docs
  createDatabase(function() {

    // clear canvas
    initCanvas(500,500);

    if (navigator.getUserMedia) {
      navigator.getUserMedia({video: true, audio: false}, success, error);
    } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({video: { facingMode: "environment"} , audio: false})
          .then(success)
          .catch(error);
    } else if (navigator.webkitGetUserMedia) {
      navigator.webkitGetUserMedia({video:true, audio: false}, success, error);
    } else if (navigator.mozGetUserMedia) {
      navigator.mozGetUserMedia({video: true, audio: false}, success, error);
    }
    setInterval(captureToCanvas, 500);

    renderTable();
  });

});
