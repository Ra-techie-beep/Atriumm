var express = require("express");
var fileuploader = require("express-fileupload");
var mysql2 = require("mysql2");
var cloudinary = require("cloudinary");
var cors = require("cors");
var bcrypt = require("bcrypt");
var bodyParser = require("body-parser");
var app = express();

app.use(cors());
app.use(fileuploader());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json()); // built-in in Express 4.16+


app.listen(1005, function () {
     console.log("Server Started at Port no: 1005");
})

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyBJr8lSg29yiYyDvYcxYxub0gu-mDrJaTo");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
app.get("/", function (req, resp) {
    console.log(__dirname);
    console.log(__filename);


    let path = __dirname + "/public/index.html";
    resp.sendFile(path);
})

app.use(express.urlencoded(true)); //convert POST data to JSON object 

cloudinary.config({
    cloud_name: 'drzyrhs2v',
    api_key: '668561822366772',
    api_secret: 'A3SFQCJEFwLjCzrgqCUk61ULzyk'
});

//--------------------------------AIven started---------------------------
let dbconfig = "mysql://avnadmin:AVNS_eenAnpvGtPXT37LRGEh@mysql-1cb57821-singlaramyak-08d4.c.aivencloud.com:19204/defaultdb"

let mySqlven = mysql2.createConnection(dbconfig);
mySqlven.connect(function (errkuch) {
    if (errkuch == null)
        console.log("Aiven CONNECTED SUCCESSFULLY");
    else
        console.log(errkuch.message);
})

app.get("/signup", function (req, resp) {

    let emailid = req.query.txtEmail;
    let pwd = req.query.txtPwd;
    let userType = req.query.txtUser;

    
    mySqlven.query("insert into signup2025 values(?,?,?,current_date(),?)", [emailid, pwd, userType, 1], function (errkuch) {

        if (errkuch == null)
            resp.send("REcord saved successfully......");
        else
            resp.send(errkuch.message);
    })

})

app.get("/login", function (req, resp) {
    let emailid = req.query.txtEmailL;
    let pwd = req.query.txtPwdL;

    let query = "SELECT * FROM signup2025 WHERE emailid = ? AND pwd = ?";

    mySqlven.query(query, [emailid, pwd], function (err, allRecords) {
        if (err) {
            console.error("Database error:", err);
            resp.status(500).send("Server error");
            return;
        }

        if (allRecords.length === 1) {
            let status = allRecords[0].status;

            if (status == 0) {
                resp.send("Blocked");
            } else if (status == 1) {
                resp.send(allRecords[0].userType); // e.g., "organizer" or "player"
            }
        } else {
            resp.send("Invalid");
        }
    });
});

//------------------------------
app.post("/server-signup-safe", async function (req, resp) {

    let picurl = "";
    if (req.files != null) {
        picurl = req.files.profilePic.name;
        let Fullpath = __dirname + "/public/uploads/" + picurl;
        req.files.profilePic.mv(Fullpath);


        await cloudinary.uploader.upload(Fullpath).then(function (picUrlResult) {
            picurl = picUrlResult.url;
            console.log(picurl);
        });
    }
    else
        picurl = "nopic.jpg";

    req.body.picname = picurl;

    let emailid = req.body.inputEmail;
    let orgname = req.body.inputName;
    let regnumber = req.body.inputReg;
    let address = req.body.inputState;
    let address2 = req.body.inputCity;
    let city = req.body.inputZip;
    let state = req.body.inputAddress;
    let website = req.body.inputAddress2;
    let insta = req.body.inputInsta;
    let head = req.body.inputHead;
    let contact = req.body.inputContact;
    let otherinfo = req.body.inputinfo;
    let zip = req.body.inputZip;
    let detailinsports = req.body.inputDeal;

    mySqlven.query("insert into organizers values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [emailid, orgname, regnumber, address, address2, city, state, zip, detailinsports, website, insta, head, contact, picurl, otherinfo], function (errkuch) { // ? are called in paramaters

        if (errkuch == null)
            resp.send("REcord saved successfully......");
        else
            resp.send(errkuch.message);
    })

})


/* resp.send(req.body);*/
//console.log(req.body)


app.get("/get-one", function (req, resp) {
    mySqlven.query("select * from organizers where emailid=?", [req.query.inputEmail], function (errkuch, allRecords) {

        if (allRecords.length == 0)
            resp.send("No Record Found");
        else
            resp.json(allRecords);

    })
})

app.post("/Update-user", async function (req, resp) {

    let picurl = "";
    if (req.files != null) {
        picurl = req.files.profilePic.name;
        let Fullpath = __dirname + "/public/uploads/" + picurl;
        req.files.profilePic.mv(Fullpath);


        await cloudinary.uploader.upload(Fullpath).then(function (picUrlResult) {
            picurl = picUrlResult.url;
            console.log(picurl);
        });
    }
    else
        picurl = req.body.hdn;


    let emailid = req.body.inputEmail;
    let orgname = req.body.inputName;
    let regnumber = req.body.inputReg;
    let address = req.body.inputState;
    let address2 = req.body.inputCity;
    let city = req.body.inputZip;
    let state = req.body.inputAddress;
    let website = req.body.inputAddress2;
    let insta = req.body.inputInsta;
    let head = req.body.inputHead;
    let contact = req.body.inputContact;
    let otherinfo = req.body.inputinfo;
    let zip = req.body.inputZip;
    let dealinsports = req.body.inputDeal;

    mySqlven.query("update organizers set orgname=?,regnumber=?,address=?,address2=?,city=?,state=?,website=?,insta=?,head=?,contact=?,otherinfo=?,zip=?,dealinsports=?,picurl=? where emailid=?", [orgname, regnumber, address, address2, city, state, website, insta, head, contact, otherinfo, zip, dealinsports, picurl, emailid], function (errkuch, result) // ? are called in paramaters,function(errKuch,result)
    {
        if (errkuch == null) {
            if (result.affectedRows == 1)
                resp.send("Updated.....");
            else
                resp.send("Errorr...");
        }
        else
            resp.send(errkuch.message)
    })

})

app.get("/save-details", function (req, resp) {
    let emailid = req.query.inputEmail;
    let title = req.query.inputTitle;
    let doe = req.query.inputDate;
    let toe = req.query.inputTime;
    let address = req.query.inputAddress;
    let state = req.query.inputState;
    let city = req.query.inputCity;
    let zip = req.query.inputZip;
    let sports = req.query.inputSport;
    let minage = req.query.inputAge;
    let maxage = req.query.inputAge2;
    let lastdate = req.query.inputLast;
    let timeR = req.query.inputTimeR;
    let fee = req.query.inputFee;
    let prize = req.query.inputPrize;
    let contact = req.query.inputContact4;

    mySqlven.query("insert into tournaments value(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [null, emailid, title, doe, toe, address, state, city, zip, sports, minage, maxage, lastdate, timeR, fee, prize, contact], function (errkuch) // ? are called in paramaters,function(errKuch,result)
    {
        if (errkuch == null)
            resp.send("Tournament Details Published Successfully");
        else
            resp.send(errkuch.message);
    })

})


app.get("/do-fetch-all-users", function (req, resp) {
    let emailid = req.query.emailidKuch;

    if (!emailid) {
        resp.status(400).send({ error: "Missing emailid" });
        return;
    }

    mySqlven.query("SELECT * FROM tournaments WHERE emailid = ?", [emailid], function (err, allRecords) {
        if (err) {
            console.error("DB Error:", err);
            resp.status(500).send({ error: "Database error occurred." });
            return;
        }

        resp.send(allRecords);
    });
});


app.get("/delete-one", function (req, resp) {
    console.log(req.query)
    let rid = req.query.rid;
    let emailid = req.query.emailid
    mySqlven.query("delete from tournaments where rid=?", [rid], function (errKuch, result) {
        if (errKuch == null) {
            if (result.affectedRows == 1)
                resp.send(emailid + " Deleted Successfulllyyyy...");
            else
                resp.send("Invalid");
        }
        else
            resp.send(errKuch);

    })
})


app.get("/do-fetch", function (req, resp) {
    mySqlven.query("select * from signup2025", function (_err, allRecords) {
        resp.send(allRecords);
    })
})

app.get("/resume-one", function (req, resp) {
    let emailid = req.query.emailid;
    mySqlven.query("update signup2025 set status=? where emailid=? ", [1, emailid], function (_err, allRecords) {
        resp.send(allRecords);

    })
})


app.get("/block-one", function (req, resp) {
    let emailid = req.query.emailid;

    mySqlven.query("update signup2025 set status=? where emailid=? ", [0, emailid], function (_err, allRecords) {

        resp.send(allRecords);
    })
})


app.get("/fetch-events", function (req, resp) {
    let sports = req.query.sports;
    let city = req.query.city;

    if (!sports || !city || sports === "Choose") {
        return resp.status(400).send("Missing or invalid sports/city value");
    }

    mySqlven.query(
        "SELECT * FROM tournaments WHERE sports = ? AND city = ?",
        [sports, city],
        function (_err, allRecords) {
            if (_err) {
                console.error(_err);
                return resp.status(500).send("Database error");
            }

            resp.send(allRecords); // JSON array
        }
    );
});

app.get("/do-fetch-all-cities", function (req, resp) {
    mySqlven.query("select distinct city from tournaments", function (err, allRecords) {
        resp.send(allRecords);
    })
})



// POST /settings route
app.get("/settings", function (req, resp) {
  const { txtEmailid, txtpass, txtrepeat } = req.query;

  if (!txtEmailid || !txtpass || !txtrepeat) {
    return resp.status(400).send("All fields are required.");
  }

  mySqlven.query(
    "SELECT pwd FROM signup2025 WHERE emailid=? AND userType='player'",
    [txtEmailid],
    function (err, result) {
      if (err) return resp.status(500).send("Database error: " + err.message);
      if (result.length === 0) return resp.status(404).send("User not found");

      const storedPwd = result[0].pwd;

      if (txtpass !== storedPwd) {
        return resp.status(401).send("Current password is incorrect");
      }

      // Update new password
      mySqlven.query(
        "UPDATE signup2025 SET pwd=? WHERE emailid=? AND userType='player'",
        [txtrepeat, txtEmailid],
        function (err2, result2) {
          if (err2) return resp.status(500).send("Update error: " + err2.message);
          if (result2.affectedRows === 1)
            resp.send("Password updated successfully");
          else
            resp.status(400).send("Password update failed");
        }
      );
    }
  );
});

app.get("/settingsorganizer", function (req, resp) {
  const { txtEmailid2, txtpass2, txtrepeat2 } = req.query;

  if (!txtEmailid2 || !txtpass2 || !txtrepeat2) {
    return resp.status(400).send("All fields are required.");
  }

  // Get current password for this organizer
  mySqlven.query(
    "SELECT pwd FROM signup2025 WHERE emailid=? AND userType='organizer'",
    [txtEmailid2],
    function (err, result) {
      if (err) {
        return resp.status(500).send("Database error: " + err.message);
      }
      if (result.length === 0) {
        return resp.status(404).send("User not found");
      }

      const storedPwd = result[0].pwd;

      if (txtpass2 !== storedPwd) {
        return resp.status(401).send("Current password is incorrect");
      }

      // Password matched, now update to new password
      mySqlven.query(
        "UPDATE signup2025 SET pwd=? WHERE emailid=? AND userType='organizer'",
        [txtrepeat2, txtEmailid2],
        function (err2, result2) {
          if (err2) {
            return resp.status(500).send("Update error: " + err2.message);
          }
          if (result2.affectedRows === 1) {
            resp.send("Password updated successfully");
          } else {
            resp.status(400).send("Password update failed");
          }
        }
      );
    }
  );
});




//--------------------------------------------------------

async function RajeshBansalKaChirag(imgurl) {
    const myprompt = `
Extract the Aadhaar card details from the image. Respond only with a valid JSON, no Markdown, no commentary.
Required JSON keys: adhaar_number, name, gender, dob
Strictly output:
{"adhaar_number":"...","name":"...","gender":"...","dob":"..."}
`;
    const imageResp = await fetch(imgurl)
        .then((response) => response.arrayBuffer());

    const result = await model.generateContent([
        {
            inlineData: {
                data: Buffer.from(imageResp).toString("base64"),
                mimeType: "image/jpeg",
            },
        },
        myprompt,
    ]);
    console.log(result.response.text())

    const cleaned = result.response.text().replace(/```json|```/g, '').trim();
    const jsonData = JSON.parse(cleaned);
    console.log(jsonData);

    return jsonData

}

app.post("/picreader", async function (req, resp) {
    let fileName;
    if (req.files != null) {
        //const myprompt = "Read the text on picture and tell all the information";
        //  const myprompt = "Read the text on picture in JSON format";
        fileName = req.files.profileP.name;
        let locationToSave = __dirname + "/public/uploads/" + fileName;//full ile path

        req.files.profileP.mv(locationToSave);//saving file in uploads folder

        //saving ur file/pic on cloudinary server
        try {
            await cloudinary.uploader.upload(locationToSave).then(async function (picUrlResult) {

                let jsonData = await RajeshBansalKaChirag(picUrlResult.url); // await lgaana hi hai issmei

                resp.send(jsonData);

            });

            //var respp=await run("https://res.cloudinary.com/dfyxjh3ff/image/upload/v1747073555/ed7qdfnr6hez2dxoqxzf.jpg", myprompt);
            // resp.send(respp);
            // console.log(typeof(respp));
        }
        catch (err) {
            resp.send(err.message)
        }

    }
})
app.post("/save-profile", async function (req, resp) {
    try {
        if (!req.files || !req.files.profileP || !req.files.profilePic) {
            return resp.status(400).send("Both Aadhaar and Profile images are required.");
        }

        // Aadhaar image
        const acardFile = req.files.profileP;
        const acardPath = __dirname + "/public/uploads/" + acardFile.name;
        await acardFile.mv(acardPath);

        const acardUpload = await cloudinary.uploader.upload(acardPath);
        const acardpicurl = acardUpload.secure_url;

        // Extract data using OCR function (RajeshBansalKaChirag)
const jsonData = await RajeshBansalKaChirag(acardpicurl) || {};

        // Profile image
        const profileFile = req.files.profilePic;
        const profilePath = __dirname + "/public/uploads/" + profileFile.name;
        await profileFile.mv(profilePath);

        const profileUpload = await cloudinary.uploader.upload(profilePath);
        const profilepicurl = profileUpload.secure_url;

        // Form fields (sent via req.body, not req.query)
        const emailid = req.body.inputEmaill;
        const address = req.body.inputaddress;
        const contact = req.body.inputNumber;
        const game = req.body.inputGame;
        const other = req.body.inputother;

        if (!emailid || !address || !contact || !game) {
    return resp.status(400).send("Required fields are missing.");
}

        // Insert into DB
        mySqlven.query(
            "INSERT INTO players VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                emailid,
                acardpicurl,
                profilepicurl,
                jsonData.name || "",
                jsonData.dob || "",
                jsonData.gender || "",
                address,
                contact,
                game,
                other,
            ],
            function (err, result) {
                if (err) return resp.status(500).send("DB Error: " + err.message);
                resp.send("Profile updated successfully.");
            }
        );
    } catch (err) {
        console.error("Error in /save-profile:", err);
        resp.status(500).send("Server Error: " + err.message);
    }
});


app.get("/sendmessage", function(req,resp){
     let emailid = req.query.contactEmail;
    let name = req.query.contactName;
    let message = req.query.contactMessage;

    
    mySqlven.query("insert into messages values(?,?,?,current_date())", [name, emailid, message], function (errkuch) {

        if (errkuch == null)
            resp.send("REcord saved successfully......");
        else
            resp.send(errkuch.message);
    })
})