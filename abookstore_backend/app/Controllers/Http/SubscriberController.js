"use strict";

const Subscriber = use("App/Models/Subscriber")
const Mail = use("Mail")
const Logger = use("Logger")
class SubscriberController {
  async index({ response }) {
    try {
      const allSubscribers = await Subscriber.all()
      //   console.log(allSubscriber.toJSON());
      if (allSubscribers.toJSON().length !== 0)
        return response.status(200).json({
          message: "All Subscribers are get successfully",
          success: true,
          data: allSubscribers
        })

      return response.status(301).json({
        message: "Sorry! No Subscriber found",
        success: false
      })

    } catch (error) {
      return response.status(500).json({
        message: "Server Error occurred",
        success: false
      });
    }
  }

  async store({ request, response }) {
    const { email, subscriber_id } = request.all()

    try {
      const subscription = await Subscriber.create({
        email: email,
        subscriber_type: subscriber_id ? "USER" : "GUST",
        subscriber_id: subscriber_id,
        announcement: true,
        sale_invitation: true,
        weekly_newsletter: true,
        unsubscribe: false
      });
      if (subscription) {
        this.sendMail(
          `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
            <head>
            <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
            <meta content="width=device-width" name="viewport"/>
            <!--[if !mso]><!-->
            <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
            <!--<![endif]-->
            <title></title>
            <!--[if !mso]><!-->
            <!--<![endif]-->
            <style type="text/css">
                body {
                  margin: 0;
                  padding: 0;
                }

                table,
                td,
                tr {
                  vertical-align: top;
                  border-collapse: collapse;
                }

                * {
                  line-height: inherit;
                }

                a[x-apple-data-detectors=true] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
              </style>
            <style id="media-query" type="text/css">
                @media (max-width: 620px) {

                  .block-grid,
                  .col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }

                  .block-grid {
                    width: 100% !important;
                  }

                  .col {
                    width: 100% !important;
                  }

                  .col>div {
                    margin: 0 auto;
                  }

                  img.fullwidth,
                  img.fullwidthOnMobile {
                    max-width: 100% !important;
                  }

                  .no-stack .col {
                    min-width: 0 !important;
                    display: table-cell !important;
                  }

                  .no-stack.two-up .col {
                    width: 50% !important;
                  }

                  .no-stack .col.num4 {
                    width: 33% !important;
                  }

                  .no-stack .col.num8 {
                    width: 66% !important;
                  }

                  .no-stack .col.num4 {
                    width: 33% !important;
                  }

                  .no-stack .col.num3 {
                    width: 25% !important;
                  }

                  .no-stack .col.num6 {
                    width: 50% !important;
                  }

                  .no-stack .col.num9 {
                    width: 75% !important;
                  }

                  .video-block {
                    max-width: none !important;
                  }

                  .mobile_hide {
                    min-height: 0px;
                    max-height: 0px;
                    max-width: 0px;
                    display: none;
                    overflow: hidden;
                    font-size: 0px;
                  }

                  .desktop_hide {
                    display: block !important;
                    max-height: none !important;
                  }
                }
              </style>
            </head>
            <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #283C4B;">
            <table
            bgcolor="#283C4B"
            cellpadding="0"
            cellspacing="0"
            class="nl-container"
            role="presentation"
            style="table-layout: fixed;
            vertical-align: top;
            min-width: 320px;
            Margin: 0 auto;
            border-spacing: 0;
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            background-color: #283C4B;
            width: 100%;"
            valign="top"
            width="100%">
            <tbody>
            <tr style="vertical-align: top;" valign="top">
            <td style="word-break: break-word; vertical-align: top;" valign="top">
            <br>
            <div style="background-color:#283C4B;">
            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #3AAEE0;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#3AAEE0;">
            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
            <div style="width:100% !important;">
            <!--[if (!mso)&(!IE)]><!-->
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
            <!--<![endif]-->
            <div style="color:#FFFFFF;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:30px;padding-right:20px;padding-bottom:20px;padding-left:20px;">
            <div style="line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #FFFFFF; mso-line-height-alt: 14px;">
            <p style="font-size: 24px; line-height: 1.2; text-align: center; font-family: lucida sans unicode, lucida grande, sans-serif; word-break: break-word; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;">Welcome!</span></p>
            </div>
            </div>
            <!--[if mso]></td></tr></table><![endif]-->
            <div align="center" class="img-container center autowidth fullwidth" style="padding-right: 0px;padding-left: 0px;">
              <?xml version="1.0" encoding="iso-8859-1"?>
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
              viewBox="0 0 412.72 412.72" style="enable-background:new 0 0 412.72 412.72;" xml:space="preserve" height="100" width="100">
            <g>
              <g>
                <path d="M404.72,82.944c-0.027,0-0.054,0-0.08,0h0h-27.12v-9.28c0.146-3.673-2.23-6.974-5.76-8
                  c-18.828-4.934-38.216-7.408-57.68-7.36c-32,0-75.6,7.2-107.84,40c-32-33.12-75.92-40-107.84-40
                  c-19.464-0.048-38.852,2.426-57.68,7.36c-3.53,1.026-5.906,4.327-5.76,8v9.2H8c-4.418,0-8,3.582-8,8v255.52c0,4.418,3.582,8,8,8
                  c1.374-0.004,2.724-0.362,3.92-1.04c0.8-0.4,80.8-44.16,192.48-16h1.2h0.72c0.638,0.077,1.282,0.077,1.92,0
                  c112-28.4,192,15.28,192.48,16c2.475,1.429,5.525,1.429,8,0c2.46-1.42,3.983-4.039,4-6.88V90.944
                  C412.72,86.526,409.139,82.944,404.72,82.944z M16,333.664V98.944h19.12v200.64c-0.05,4.418,3.491,8.04,7.909,8.09
                  c0.432,0.005,0.864-0.025,1.291-0.09c16.55-2.527,33.259-3.864,50-4c23.19-0.402,46.283,3.086,68.32,10.32
                  C112.875,307.886,62.397,314.688,16,333.664z M94.32,287.664c-14.551,0.033-29.085,0.968-43.52,2.8V79.984
                  c15.576-3.47,31.482-5.241,47.44-5.28c29.92,0,71.2,6.88,99.84,39.2l0.24,199.28C181.68,302.304,149.2,287.664,94.32,287.664z
                  M214.32,113.904c28.64-32,69.92-39.2,99.84-39.2c15.957,0.047,31.863,1.817,47.44,5.28v210.48
                  c-14.354-1.849-28.808-2.811-43.28-2.88c-54.56,0-87.12,14.64-104,25.52V113.904z M396.64,333.664
                  c-46.496-19.028-97.09-25.831-146.96-19.76c22.141-7.26,45.344-10.749,68.64-10.32c16.846,0.094,33.663,1.404,50.32,3.92
                  c4.368,0.663,8.447-2.341,9.11-6.709c0.065-0.427,0.095-0.859,0.09-1.291V98.944h19.12L396.64,333.664z"/>
              </g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
            </div>

            </div>

            </div>
            </div>

            </div>
            </div>
            </div>
            <div style="background-color:#283C4B;">
            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
            <div style="width:100% !important;">
            <!--[if (!mso)&(!IE)]><!-->
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:15px; padding-right: 0px; padding-left: 0px;">
            <!--<![endif]-->
            <div style="color:#283C4B;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:30px;padding-bottom:10px;padding-left:30px;">
            <div style="line-height: 1.5; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #283C4B; mso-line-height-alt: 18px;">
            <p style="font-size: 16px; line-height: 1.5; text-align: center; font-family: lucida sans unicode, lucida grande, sans-serif; word-break: break-word; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;"><strong><span style="font-size: 16px;">Hello!</span></strong></span></p>
            <p style="font-size: 16px; line-height: 1.5; text-align: center; font-family: lucida sans unicode, lucida grande, sans-serif; word-break: break-word; mso-line-height-alt: 24px; margin: 0;"><span mce-data-marked="1" style="font-size: 16px;"><strong><span mce-data-marked="1" style="font-size: 16px;">Thanks For Your Subscription</span></strong></span></p>
            </div>
            </div>
            <div style="color:#283C4B;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.5;padding-top:10px;padding-right:30px;padding-bottom:0px;padding-left:30px;">
            <div style="line-height: 1.5; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #283C4B; mso-line-height-alt: 18px;">
            <p style="font-size: 14px; line-height: 1.5; text-align: center; font-family: lucida sans unicode, lucida grande, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;"><span style="font-size: 14px;">We will Keep Update About New Books</span></p>
            </div>
            </div>

            <div align="center" class="button-container" style="padding-top:25px;padding-right:0px;padding-bottom:0px;padding-left:0px;">

            <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#3AAEE0;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;width:auto; width:auto;;border-top:1px solid #3AAEE0;border-right:1px solid #3AAEE0;border-bottom:1px solid #3AAEE0;border-left:1px solid #3AAEE0;padding-top:10px;padding-bottom:10px;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:20px;padding-right:20px;font-size:14px;display:inline-block;"><span style="font-size: 16px; line-height: 2; font-family: lucida sans unicode, lucida grande, sans-serif; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 14px; line-height: 28px;" mce-data-marked="1" style="font-size: 14px; line-height: 28px;"><a style="text-decoration: none !important; color:#ffffff" href="http://abookstore.co.ke/">GO TO OUR SITE</a></span></span></span></div>

            </div>
            <div style="text-align:center; margin-top:45px; font-size:10px;  position: absolute; bottom: 150px;"><storng>Developed By:</strong><a href="https://civilizedtechnologies.com/">civilized technology</a></div>
            <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:20px;padding-right:20px;padding-bottom:30px;padding-left:20px;">
            <div style="line-height: 1.2; font-size: 12px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; color: #555555; mso-line-height-alt: 14px;">

            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div style="background-color:transparent;">
            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
            <div style="width:100% !important;">
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
            <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
            <tbody>
            <tr style="vertical-align: top;" valign="top">
            <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
            <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; width: 100%;" valign="top" width="100%">
            <tbody>
            <tr style="vertical-align: top;" valign="top">
            <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
            </tr>
            </tbody>
            </table>
            </td>
            </tr>
            </tbody>
            </table>
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div style="background-color:#283C4B;">
            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
            <div style="width:100% !important;">

            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div style="background-color:#283C4B;">

            </div>
            <div style="background-color:#283C4B;">
            <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 600px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
            <div class="col num12" style="min-width: 320px; max-width: 600px; display: table-cell; vertical-align: top; width: 600px;">
            <div style="width:100% !important;">
            <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:30px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
            </div>
            </div>
            </div>
            </div>
            </div>
            </div>
            </td>
            </tr>
            </tbody>
            </table>
            </body>
            </html>`,
          "Subscription Alert",
          email
        );
        return response.status(200).json({
          message: [
            {
              message: "Congrats! Your Subscription Successful",
              success: true
            }
          ]
        });
      }
    } catch (error) {
      return response.status(500).json({
        message: [
          {
            message: "Server Error Occurred",
            success: true
          }
        ]
      });
    }
  }



  async updateSubscriber({ request, response }) {

    const { email, subscriber_id, announcement, sale_invitation, weekly_newsletter, unsubscribe} = request.all();

    try {
      const data = {
        announcement: announcement,
        sale_invitation: sale_invitation,
        weekly_newsletter: weekly_newsletter,
        unsubscribe:unsubscribe
      }
      if (!data.announcement){
        data.announcement=false
      }
      if (!data.sale_invitation) {
        data.sale_invitation=false
      }
      if (!data.weekly_newsletter) {
        data.weekly_newsletter=false
      }
      if (!data.unsubscribe) {
        data.unsubscribe=false
      }
      if (data.unsubscribe) {
        data.announcement = false
        data.sale_invitation = false
        data.weekly_newsletter = false
        data.unsubscribe=true
      }

      const subscriber = await Subscriber.query().where("email", email).update(data);

      if (!subscriber) {
        data.email = email;
        data.subscriber_id = subscriber_id
        data.subscriber_type = subscriber_id ? "USER" : "GUST";

        await Subscriber.create(data);

        return response.status(200).json({
          message: "Your subscription is done successfully.",
          success: true
        });
      }

      if (subscriber) {
        return response.status(200).json({
              message: "Your Subscription Updated Successfully",
              success: true
        });
      }


    } catch (ex) {
      return response.status(500).json({
            message: "Server Error! Please wait we will fix it",
            success: false
      });
    }
  }



  async getSubscriptions({params, response}) {
    const { email } = params
    // console.log(email)
    try {
      const subscriber = await Subscriber.findBy('email', email)

      if(!subscriber){
        return response.status(200).json({
          success: true,
          message: 'User has no subscription(s).',
          data: {
            announcement: false,
            sale_invitation: false,
            weekly_newsletter: false,
            unsubscribe: false
          }
        })
      }

      return response.status(200).json({
        success: true,
        message: "Subscriber populated successfully",
        data:{
          announcement: subscriber.announcement === 1 ? true : false,
          sale_invitation: subscriber.sale_invitation === 1 ? true : false,
          weekly_newsletter: subscriber.weekly_newsletter === 1 ? true : false,
          unsubscribe: subscriber.unsubscribe === 1 ? true : false
        }
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        success: false,
        message: "Serve error occurred",
      })
    }
  }

  async sendMail(
    template,
    subject = "Subscription Alert",
    sendTo,
    sendFrom = "support@abookstore.co.ke"
  ) {
    try {
      await Mail.raw(template, message => {
        message
          .to(sendTo)
          .from(sendFrom)
          .subject(subject);
      });
    } catch (error) {
      Logger.error(error);
      return response.status(500).json({
        status: false,
        message: "Can not sent Mail."
      });
    }
  }
}

module.exports = SubscriberController;
