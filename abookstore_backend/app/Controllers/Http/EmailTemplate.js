function EmailConfirmationTem(link) {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email confirm</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap">
  </head>
  
  <body style="background: #f0f2f3;
      padding: 20px;
      margin: 0;
      color: #444444;
      font-family: 'Crimson Text', serif;">
    <div style="margin: auto;width: 80%;">
      <div style="text-align: center;">
        <img style="width:130px;
        margin: auto;" src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/logo.png" alt="">
      </div>
      <div style="margin-top: 20px;
      padding: 35px;
      background: white;
      border-top: 10px solid #3897cf;
      border-radius: 3px;
      box-shadow: 0 0 18px 0px #00000005;">
  
        <img style="width: 200px;margin: auto;display: block;"
          src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/email.jpg" alt="">
        <div style="margin-top: 20px;">
          <h1 style="text-align: center;
          font-size: 36px;
          text-transform: uppercase;">Verify &nbsp;your &nbsp;email &nbsp;address</h1>
          <p style="width: 530px;
          margin: auto;
          font-size: 18px;">
            Hello ! <br><br>
            Please click the button below to check your email address.
            If you did not create an email account with us, no further action is required.
            <br>
            <br>
            Regards,
            <br>
            Book House
          </p>
          <br>
          <br>
          <p style="width: 530px;
          margin: auto;
          font-size: 18px;">If you are having trouble clicking the “verify email address” button,
            copy and paste the URL below into your
            web browser
            <br>
            <span style="color: #3897cf;"><i>${link}</i></span> </p>
          <a href="${link}" style="margin: auto;
          display: block;
          margin-top: 40px;
          font-style: normal !important;
          width: 140px;
          padding: 15px 45px;
          border-radius: 3px;
          border: none;
          text-decoration: none;
          background: #3897cf;
          font-family: serif;
          font-size: 16px;
          font-weight: 900;
          color: white !important;
          cursor: pointer;">
            Verify Email Adress
          </a>
        </div>
      </div>
      <div style="margin-top: 80px;
      text-align: center;">
        <img style="width: 140px;"
          src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/stay-touch.png" alt="">
        <div>
          <div style="margin: auto; width: 200px; margin-top: 10px;">
            <a target="_blank" href="https://www.facebook.com/Abookstore-574617176550119/">
              <div style="border-radius: 3px;
              width: 35px;
              height: 35px;
              display: inline-block;
              margin-right: 10px;
              background: rgb(0, 102, 255);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                  src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/fb.png"
                  alt="facebook link bookstore">
              </div>
            </a>
            <a target="_blank" href="https://twitter.com/abookstore3">
              <div style="border-radius: 3px;
              width: 35px;
              display: inline-block;
              height: 35px;
              margin-right: 10px;
              background: rgb(56, 136, 255);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px" src="
                  https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/twit.png"
                  alt="twitter link bookstore">
              </div>
            </a>
            <a target="_blank" href="https://www.instagram.com/abookstore_/">
              <div
                style="border-radius: 3px;
              width: 35px;
              display: inline-block;  
              height: 35px;
              background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                  src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/instagram.png"
                  alt="instagram link bookstore">
              </div>
            </a>
          </div>
        </div>
      </div>
      <div style=" text-align: center;margin-top: 20px;">
        <small>
          Email sent by Abookstore
          <br>
          Copyright © 2020 Abookstor | All rights reserved by CreativeWork007
        </small>
      </div>
    </div>
  </body>
  
  </html>`
}

function AfterPurchase(books, total_item, tax, delivary_crg, discount, total_bill, address, email, estimated_date) {

  const first_name = address.hasOwnProperty("first_name")
    ? address.first_name
    : "";
  const last_name = address.hasOwnProperty("last_name")
    ? address.last_name
    : "";
  const adrs = address.hasOwnProperty("address") ? address.address : "";
  const estate = address.hasOwnProperty("estate") ? address.estate : "";
  const city = address.hasOwnProperty("city") ? address.city : "";
  const phone = address.hasOwnProperty("phone") ? address.phone : "";

  let book_list = "";
  books.map((book) => {
    const imgs = JSON.parse(book.cover_images)
    book_list += `
  <div class="book-list mt-15">
    <div class="book-detail d-in-b">
      <img src="${imgs.img_1 || imgs.img_2}" alt="">
      <div class="d-in-b oa">
        <div class="book-name"><b>${book.name}</b></div>
        <div class="gray">${book.category}</div>
      </div>
    </div>
    <div class="quan d-in-b blue">${book.quantity}</div>
    <div class="price d-in-b">KSH ${Number(book.quantity) * Number(book.price)}</div>
  </div>`;
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>After Purchase</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap">
  
  
    <style>
      .body {
        background: #f0f2f3;
        padding: 20px;
        margin: 0;
        color: #444444 !important;
        font-family: "Crimson Text", serif;
      }
  
      .im {
        color: #444444 !important;
      }
  
      .mail-us {
        margin: auto;
        margin-top: 20px;
        width: 300px;
        text-align: center;
      }
  
      .wrapper {
        margin: auto;
        width: 80%;
      }
  
      .mail-body {
        margin-top: 20px;
        padding: 35px;
        background: white;
        border-top: 10px solid #3897cf;
        border-radius: 3px;
        box-shadow: 0 0 18px 0px #00000005;
      }
  
      .content {
        margin-top: 20px;
      }
  
      .content h1 {
        text-align: center;
        font-size: 36px;
        text-transform: uppercase;
      }
  
      .blue {
        color: #3897cf;
      }
  
      .content p {
        width: 530px;
        margin: auto;
        font-weight: bold;
        font-size: 18px;
      }
  
      .content a {
        color: #3897cf;
        font-style: italic;
      }
  
      .actn-btn {
        margin: auto;
        display: block;
        margin-top: 30px;
        text-decoration: none;
        padding: 15px 45px;
        border-radius: 3px;
        border: none;
        background: #3897cf;
        font-family: serif;
        font-size: 16px;
        font-weight: 900;
        color: white !important;
        cursor: pointer;
        font-style: normal !important;
        display: inline-block;
      }
  
      .actn-btn:hover {
        background: #2279ac;
      }
  
  
  
      .summary {
        width: 530px;
        margin: auto;
      }
  
      .hr {
        border-top: 3px solid rgb(221, 221, 221);
        margin-bottom: 20px;
        margin-top: 20px;
      }
  
      .book-detail {
        position: relative;
      }
  
      .d-in-b {
        display: inline-block;
      }
  
      .book-detail img {
        max-height: 50px;
        max-width: 50px;
        min-height: 50px;
        min-width: 50px;
        margin-right: 10px;
      }
  
      .gray {
        color: rgb(163, 163, 163);
      }
  
      .mt-15 {
        margin-top: 15px;
      }
  
      .mt-5 {
        margin-top: 5px;
      }
  
      .footer {
        text-align: center;
        margin-top: 20px;
      }
  
      .oa {
        overflow: auto;
      }
  
      .book-list {
        position: relative;
      }
  
      .book-list .price {
        float: right;
        margin-top: 40px;
        font-weight: bold;
      }
  
      .book-detail {
        width: 300px;
      }
  
      .fl-r {
        float: right;
      }
    </style>
  
  </head>
  
  <body class="body">
    <div class="wrapper">
      <div style="text-align: center;">
        <img style="width:130px;
        margin: auto;" src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/logo.png" alt="">
      </div>
      <div class="mail-body">
        <img style="width: 200px;margin: auto;display: block;"
          src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/check.jpg" alt="">
        <div class="content">
          <h1>We received your order</h1>
          <p>Hello <span class="blue buyer-name">${first_name} ${last_name}</span>, <br>
            We received your request and we will let you know when we ship it out.<br>
            We will be in touch, but you can also get information from your order clicking on Track order.<br>
            <br><br>
            Regards,<br>
            Book House
          </p>
          <div style="text-align: center;"><a target="_blank" href="https://abookstore.co.ke/my-order" class="actn-btn">Track Order</a>
          </div>
          <div class="mail-us">
            <small>
              If you have any questions, concerns, or suggestions, please Email us: <span
                class="blue"><i>info@abookstore.co.ke</i></span>
            </small>
          </div>
        </div>
        <div class="summary">
          <h4>SUMMARY</h4>
          <div class="hr"></div>
  
          ${book_list}
  
          <div class="hr"></div>
  
          <div class=" mt-5">
            <b>Total Item</b>
            <b class="fl-r">${total_item}</b>
          </div>
          <div class=" mt-5">
            <b>Tax and Charges</b>
            <b class="fl-r">${tax}</b>
          </div>
          <div class=" mt-5">
            <b>Delivary Fee</b>
            <b class="fl-r">${delivary_crg}</b>
          </div>
          <div class=" mt-5">
            <b>Discount</b>
            <b class="fl-r">${discount}</b>
          </div>
  
          <div class="hr"></div>
  
          <div class=" mt-5">
            <h3 class="d-in-b">Total Bill</h3>
            <h3 class="fl-r">KSH ${total_bill}</h3>
          </div>
  
          <div class="hr"></div>
  
          <br>
  
          <div>
            <div class="d-in-b">
              <div><small class="gray">Billed To:</small></div>
              <b>
              Name  : ${first_name} ${last_name}
              <br>
              Address: ${adrs}, ${estate}, ${city}
              <br>
              Email: ${email}
              <br>
              Phone: ${phone}
              </b>
            </div>
            <div class="fl-r oa">
              <div><small class="gray">Estimated Delivery Date</small></div>
              <b>${estimated_date}</b>
            </div>
          </div>
  
        </div>
      </div>
      <div style="margin-top: 80px;
      text-align: center;">
        <img style="width: 140px;"
          src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/stay-touch.png" alt="">
        <div>
          <div style="margin: auto; width: 200px; margin-top: 10px;">
            <a target="_blank" href="https://www.facebook.com/Abookstore-574617176550119/">
              <div style="border-radius: 3px;
              width: 35px;
              height: 35px;
              display: inline-block;
              margin-right: 10px;
              background: rgb(0, 102, 255);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                  src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/fb.png"
                  alt="facebook link bookstore">
              </div>
            </a>
            <a target="_blank" href="#">
              <div style="border-radius: 3px;
              width: 35px;
              display: inline-block;
              height: 35px;
              margin-right: 10px;
              background: rgb(56, 136, 255);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px" src="
                  https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/twit.png"
                  alt="twitter link bookstore">
              </div>
            </a>
            <a target="_blank" href="https://www.instagram.com/abookstore_/">
              <div
                style="border-radius: 3px;
              width: 35px;
              display: inline-block;  
              height: 35px;
              background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);">
                <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                  src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/instagram.png"
                  alt="instagram link bookstore">
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="footer">
        <small>
          Email sent by Abookstore
          <br>
          Copyright © 2020 Abookstor | All rights reserved by CreativeWork007
        </small>
      </div>
    </div>
  </body>
  
  </html>
  `
}

function TrackOrderMailTemplate(customer_name, title, body) {
  return `
  <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email confirm</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&display=swap">
</head>

<body style="background: #f0f2f3;
    padding: 20px;
    margin: 0;
    color: #444444;
    font-family: 'Crimson Text', serif;">
  <div style="margin: auto;width: 80%;">
    <div style="text-align: center;">
      <img style="width:130px;
      margin: auto;" src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/logo.png" alt="">
    </div>
    <div style="margin-top: 20px;
    padding: 35px;
    background: white;
    border-top: 10px solid #3897cf;
    border-radius: 3px;
    box-shadow: 0 0 18px 0px #00000005;">

      <img style="width: 200px;margin: auto;display: block;"
        src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/truck.png" alt="">
      <div style="margin-top: 20px;">
        <h1 style="text-align: center;
        font-size: 36px;
        text-transform: uppercase;">${title}</h1>
        <p style="width: 530px;
        margin: auto;
        font-size: 18px;">
          Hello ${customer_name} ! <br><br>
          ${body}
          <br>
          <br>
          Regards,
          <br>
          Book House
        </p>
        <br>
        <br>
        
        <a href="https://abookstore.co.ke/my-order" style="margin: auto;
        display: block;
        margin-top: 40px;
        font-style: normal !important;
        width: 90px;
        padding: 15px 45px;
        border-radius: 3px;
        border: none;
        text-decoration: none;
        background: #3897cf;
        font-family: serif;
        font-size: 16px;
        font-weight: 900;
        color: white !important;
        cursor: pointer;">
          Track order
        </a>
      </div>
    </div>
    <div style="margin-top: 80px;
    text-align: center;">
      <img style="width: 140px;"
        src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/stay-touch.png" alt="">
      <div>
        <div style="margin: auto; width: 200px; margin-top: 10px;">
          <a target="_blank" href="https://www.facebook.com/Abookstore-574617176550119/">
            <div style="border-radius: 3px;
            width: 35px;
            height: 35px;
            display: inline-block;
            margin-right: 10px;
            background: rgb(0, 102, 255);">
              <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/fb.png"
                alt="facebook link bookstore">
            </div>
          </a>
          <a target="_blank" href="https://twitter.com/abookstore3">
            <div style="border-radius: 3px;
            width: 35px;
            display: inline-block;
            height: 35px;
            margin-right: 10px;
            background: rgb(56, 136, 255);">
              <img style="max-width: 25px;max-height: 25px;margin-top:5px" src="
                https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/twit.png"
                alt="twitter link bookstore">
            </div>
          </a>
          <a target="_blank" href="https://www.instagram.com/abookstore_/">
            <div
              style="border-radius: 3px;
            width: 35px;
            display: inline-block;  
            height: 35px;
            background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%);">
              <img style="max-width: 25px;max-height: 25px;margin-top:5px"
                src="https://s3-eu-west-1.amazonaws.com/abookstore.co.ke/mail_template_asset/instagram.png"
                alt="instagram link bookstore">
            </div>
          </a>
        </div>
      </div>
    </div>
    <div style=" text-align: center;margin-top: 20px;">
      <small>
        Email sent by Abookstore
        <br>
        Copyright © 2020 Abookstor | All rights reserved by CreativeWork007
      </small>
    </div>
  </div>
</body>

</html>
  `
}

module.exports = { EmailConfirmationTem, AfterPurchase,TrackOrderMailTemplate }