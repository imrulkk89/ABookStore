$(document).ready(function () {
  function getCSRFtoken() {
    return $('input[name="_csrf"]').val();
  }

  const category = (function () {
    const $category = $("#category");
    const $stage = $("#stage");

    const getSubCategories = (categoryValue, stage) => {
      $stage.empty();
      const csrfToken = getCSRFtoken();

      $.ajax({
        url: `/admin/stage-data/${categoryValue}`,
        type: "GET",
        cache: false,
        contentType: "application/json",
        headers: { "X-CSRF-Token": csrfToken },
        complete: function (result) {
          if (result.status === 200) {
            const stages = result.responseJSON.data;
            $.each(stages, function (index, item) {
              if (item.id === Number(stage)) {
                $stage.append(
                  `<option selected value=${item.id}>${item.stage}</option>`
                );
              } else {
                $stage.append(
                  `<option value=${item.id}>${item.stage}</option>`
                );
              }
            });
          } else {
            console.log(result.responseText);
          }
        },
      });
    };

    const selectedCategory = $category.children("option:selected").val();
    const selectedStage = $("#selected_stage").val();
    getSubCategories(selectedCategory, selectedStage);

    $category.on("change", function () {
      getSubCategories(this.value);

      // No 4 is Stationary
      if (parseInt(this.value) === 4) {
        $("#bookAdditionalPrices").addClass("d-none");
      } else {
        $("#bookAdditionalPrices").removeClass("d-none");
      }
    });
  })();

  const bookCoverUpload = (function () {
    $(".removeImgIcon").hide();

    const productGallery = $(".productGalleryList");
    const images = productGallery.find("img");

    images.each(function (index, elem) {
      if (elem.getAttribute("src") === "") {
        $(`#image${index + 1}-blank`).show();
        $(elem).hide();
      } else {
        $(`#image${index + 1}-blank`).hide();
        $(".productGalleryList")
          .find(`#removeIcon${index + 1}`)
          .show();
      }
    });

    function showImage(input, imgNo) {
      if (input.files && input.files[0]) {
        const reader = new FileReader(input.files[0]);

        reader.onload = function (e) {
          $(`#image${imgNo}-blank`).hide();
          $(`#image${imgNo}`).attr("src", e.target.result);
          $("#main-image").attr("src", $(`#image1`).attr("src"));
          $(".productGalleryList").find(`#removeIcon${imgNo}`).show();
          $(".productGalleryList").find(`img#image${imgNo}`).show();
        };

        reader.readAsDataURL(input.files[0]);
      }
    }

    $("#imageBrowse1").change(function () {
      showImage(this, 1);
      $(".productGalleryList").find("#imageBrowse1").prop("disabled", true);
      $("#del_img_1").remove();
    });

    $("#imageBrowse2").change(function () {
      showImage(this, 2);
      $(".productGalleryList").find("#imageBrowse2").prop("disabled", true);
      $("#del_img_2").remove();
    });

    $("#imageBrowse3").change(function () {
      showImage(this, 3);
      $(".productGalleryList").find("#imageBrowse3").prop("disabled", true);
      $("#del_img_3").remove();
    });

    $(document).on("click", "#removeIcon1", function (e) {
      e.preventDefault();

      $(`#image1`).attr("src", "");
      $(`#image1-blank`).show();
      $(".productGalleryList").find(`#removeIcon1`).hide();
      $(".productGalleryList").find(`img#image1`).hide();
      $(".productGalleryList").find("#imageBrowse1").removeAttr("disabled");
      $("#imageLabel1").append(
        `<input type="hidden" id="del_img_1" name="delete_img_1" value="img_1">`
      );
    });

    $(document).on("click", "#removeIcon2", function (e) {
      e.preventDefault();

      $(`#image2`).attr("src", "");
      $(`#image2-blank`).show();
      $(".productGalleryList").find(`#removeIcon2`).hide();
      $(".productGalleryList").find(`img#image2`).hide();
      $(".productGalleryList").find("#imageBrowse2").removeAttr("disabled");
      $("#imageLabel2").append(
        `<input type="hidden" id="del_img_2" name="delete_img_2" value="img_2">`
      );
    });

    $(document).on("click", "#removeIcon3", function (e) {
      e.preventDefault();
      $(`#image3`).attr("src", "");
      $(`#image3-blank`).show();
      $(".productGalleryList").find(`#removeIcon3`).hide();
      $(".productGalleryList").find(`img#image3`).hide();
      $(".productGalleryList").find("#imageBrowse3").removeAttr("disabled");
      $("#imageLabel3").append(
        `<input type="hidden" id="del_img_3" name="delete_img_3" value="img_3">`
      );
    });

    $(document).on("click", "#image1", function (e) {
      $("#main-image").attr("src", $(this).attr("src"));
    });
    $(document).on("click", "#image2", function (e) {
      $("#main-image").attr("src", $(this).attr("src"));
    });
    $(document).on("click", "#image3", function (e) {
      $("#main-image").attr("src", $(this).attr("src"));
    });
  })();

  $("#add-product").on("submit", function () {
    $(".productGalleryList").find("#imageBrowse1").removeAttr("disabled");
    $(".productGalleryList").find("#imageBrowse2").removeAttr("disabled");
    $(".productGalleryList").find("#imageBrowse3").removeAttr("disabled");
  });

  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $("#category-image").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#category_image").change(function () {
    readURL(this);
  });

  ///select all checkbox
  let category_id = [];
  $("#check1").click(function () {
    $(".s-checkbox").prop("checked", $(this).prop("checked"));
    const checkboxes = $(".s-checkbox");
    const all_id = checkboxes.map((value) => $(checkboxes[value]).val());
    category_id = [...all_id];
  });

  $("#action-apply-trash-all").on("click", function (e) {
    e.preventDefault();
    const csrfToken = getCSRFtoken();
    const value = $("#actions").val();

    if (value === "Move to Trash") {
      $.ajax({
        url: `/admin/products/trash-all`,
        type: "POST",
        data: JSON.stringify([category_id]),
        cache: false,
        contentType: "application/json",
        headers: { "X-CSRF-Token": csrfToken },
        complete: function (result) {
          if (result.status === 200) {
            window.location.reload();
          }
        },
      });
    }
  });

  $("#action-apply-restore-all").on("click", function (e) {
    e.preventDefault();
    console.log(category_id);
    const csrfToken = getCSRFtoken();
    const value = $("#actions").val();

    if (value === "Restore") {
      $.ajax({
        url: `/admin/products/restore-all`,
        type: "POST",
        data: JSON.stringify([category_id]),
        cache: false,
        contentType: "application/json",
        headers: { "X-CSRF-Token": csrfToken },
        complete: function (result) {
          if (result.status === 200) {
            window.location.reload();
          }
        },
      });
    }
  });
});
