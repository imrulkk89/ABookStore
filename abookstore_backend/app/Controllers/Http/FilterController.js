"use strict";
const Category = use('App/Models/Category')
const Stage = use("App/Models/Stage");
const Discipline = use("App/Models/Discipline");
const Author = use("App/Models/Author");
const Publishing = use("App/Models/Publisher");
const PublishingYear = use("App/Models/PublishingYear");
const Language = use("App/Models/Language");

class FilterController {
  async index({ view, response }) {
    try {
      //all instance of Models
      const discipline = await Discipline.all();
      const stage = await Stage.query()
        .with("category", builder => {
          return builder.select(["id", "category"]);
        })
        .fetch();

      const author = await Author.all();
      const publishing = await Publishing.all();
      const publishingYear = await PublishingYear.all();
      const language = await Language.all();

      console.log(language.toJSON())

      return view.render("settings.filter", {
        title: 'Filter',
        product: true,
        filter: true,
        disciplines: discipline.toJSON(),
        stages: stage.toJSON(),
        authors: author.toJSON(),
        publishers: publishing.toJSON(),
        publishingYears: publishingYear.toJSON(),
        languages: language.toJSON()
      });
    } catch (error) {
      console.log(error);
    }
  }

  async edit({ params, view, response }) {
    try {
      const { type, id } = params;
      switch (type) {
        case "stage":
          const stage = await Stage.query()
            .with("category", builder => {
              return builder.select(["id", "category"]);
            }).where("id", id).first();
          return view.render("settings.filter_edit", {
            success: true,
            data: stage.toJSON(),
            edit_title: "Stage"
          });
        case "discipline":
          const discipline = await Discipline.findOrFail(id);
          return view.render("settings.filter_edit", {
            success: true,
            data: discipline.toJSON(),
            edit_title: "Discipline"
          });
        case "author":
          const author = await Author.findOrFail(id);
          return view.render("settings.filter_edit", {
            success: true,
            data: author.toJSON(),
            edit_title: "Author"
          });
        case "publisher":
          const publishing = await Publishing.findOrFail(id);
          return view.render("settings.filter_edit", {
            success: true,
            data: publishing.toJSON(),
            edit_title: "Publisher"
          });
        case "publishing-year":
          const publishingYear = await PublishingYear.findOrFail(id);
          return view.render("settings.filter_edit", {
            success: true,
            data: publishingYear.toJSON(),
            edit_title: "Publishing Year"
          });
        case "book-cover":
          return false;
        case "language":
          const language = await Language.findOrFail(id);
          return view.render("settings.filter_edit", {
            success: true,
            data: language.toJSON(),
            edit_title: "Language"
          });
        default:
          return response.redirect("back");
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Server error",
        success: false
      });
    }
  }

  async update({ params, request, response, view }) {

    try {
      const { type } = params;
      const { id, name } = request.all();
      switch (type) {
        case "Stage":
          const stage = await Stage.query()
            .with("category", builder => {
              return builder.select(["id", "category"]);
            })
            .where("id", id)
            .first();
          stage.stage = name
          await stage.save();
          return response.redirect("/admin/stage");
        case "Discipline":
          const discipline = await Discipline.findOrFail(id);
          discipline.name = name;
          await discipline.save()
          return response.redirect("/admin/all-filter");
        case "Author":
          const author = await Author.findOrFail(id);
          author.name = name;
          await author.save();
          return response.redirect("/admin/all-filter");
        case "Publisher":
          const publishing = await Publishing.findOrFail(id);
          publishing.name = name;
          await publishing.save();
          return response.redirect("/admin/all-filter");
        case "Publishing Year":
          const publishingYear = await PublishingYear.findOrFail(id);
          publishing.name = name;
          await publishing.save()
          return response.redirect("/admin/all-filter");
        case "book-cover":
          return false;
        case "Language":
          const language = await Language.findOrFail(id);
          language.name = name;
          await language.save();
          return response.redirect("/admin/all-filter");
        default:
          return response.redirect("back");
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Server error",
        success: false
      });
    }
  }

  async delete({ params, response }) {
    const { type, id } = params;
    try {
      switch (type) {
        case "stage":
          const stage = await Stage.query()
            .with("category", builder => {
              return builder.select(["id", "category"]);
            }).where("id", id).first();
          await stage.delete()
          return response.redirect("/admin/all-filter");

        case "discipline":
          const discipline = await Discipline.findOrFail(id);
          await discipline.delete()
          return response.redirect("/admin/all-filter");

        case "author":
          const author = await Author.findOrFail(id);
          await author.delete()
          return response.redirect("/admin/all-filter");

        case "publisher":
          const publishing = await Publishing.findOrFail(id);
          await publishing.delete()
          return response.redirect("/admin/all-filter");

        case "publishing-year":
          const publishingYear = await PublishingYear.findOrFail(id);
          await publishingYear.delete()
          return response.redirect("/admin/all-filter");

        case "book-cover":
          return false;

        case "language":
          const language = await Language.findOrFail(id);
          await language.delete()
          return response.redirect("/admin/all-filter");
        default:
          return response.redirect("back");
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: "Server error",
        success: false
      });
    }
  }

  async filterWithCategory({ response }) {
    try {
      const categories = await Category.query()
        .with("stage", builder => builder.select(["category_id", "stage", 'id']))
        .fetch();
      return response.status(200).json({
        categories: categories.toJSON()
      });
    } catch (error) {

    }
  }

}

module.exports = FilterController;
