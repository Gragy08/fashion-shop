// Initial TinyMCE
const initialTinyMCE = () => {
  tinymce.init({
    selector: '[textarea-mce]',
    plugins: [
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount', 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'advtemplate', 'uploadcare', 'mentions', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  });
}
initialTinyMCE();
// End Initial TinyMCE

// Create an instance of Notyf
var notyf = new Notyf({
  duration: 3000,
  position: {
    x:'right',
    y:'top'
  },
  dismissible: true
});

const notifyData = sessionStorage.getItem("notify");
if(notifyData) {
  const { type, message } = JSON.parse(notifyData);
  if(type == "error") {
    notyf.error(message);
  } else if(type == "success") {
    notyf.success(message);
  }
  sessionStorage.removeItem("notify");
}

const drawNotify = (type, message) => {
  sessionStorage.setItem("notify", JSON.stringify({
    type: type,
    message: message
  }));
}

// articleCreateCategoryForm
const articleCreateCategoryForm = document.querySelector("#articleCreateCategoryForm");
if(articleCreateCategoryForm) {
  const validator = new JustValidate('#articleCreateCategoryForm');

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!',
      },
    ])
    .addField('#slug', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập đường dẫn!',
      },
    ])
    .onSuccess((event) => {
      const name = event.target.name.value;
      const slug = event.target.slug.value;
      const parent = event.target.parent.value;
      const status = event.target.status.value;
      // const description = event.target.description.value;
      const description = tinymce.get("description").getContent();

      // Tạo formData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("parent", parent);
      formData.append("status", status);
      formData.append("description", description);

      fetch(`/${pathAdmin}/article/category/create`, {
        method: "POST",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notyf.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            location.reload();
          }
        })
    });
}
// End articleCreateCategoryForm

// articleEditCategoryForm
const articleEditCategoryForm = document.querySelector("#articleEditCategoryForm");
if(articleEditCategoryForm) {
  const validator = new JustValidate('#articleEditCategoryForm');

  validator
    .addField('#name', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập tên danh mục!',
      },
    ])
    .addField('#slug', [
      {
        rule: 'required',
        errorMessage: 'Vui lòng nhập đường dẫn!',
      },
    ])
    .onSuccess((event) => {
      const id = event.target.id.value;
      const name = event.target.name.value;
      const slug = event.target.slug.value;
      const parent = event.target.parent.value;
      const status = event.target.status.value;
      const description = tinymce.get("description").getContent();

      // Tạo formData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("parent", parent);
      formData.append("status", status);
      formData.append("description", description);

      fetch(`/${pathAdmin}/article/category/edit/${id}`, {
        method: "PATCH",
        body: formData
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notyf.error(data.message);
          }

          if(data.code == "success") {
            notyf.success(data.message);
          }
        })
    });
}
// End articleEditCategoryForm

// btn-generate-slug
const buttonGenerateSlug = document.querySelector("[btn-generate-slug]");
if(buttonGenerateSlug) {
  buttonGenerateSlug.addEventListener("click", () => {
    const modalName = buttonGenerateSlug.getAttribute("btn-generate-slug");
    const from = buttonGenerateSlug.getAttribute("from");
    const to = buttonGenerateSlug.getAttribute("to");
    const string = document.querySelector(`[name="${from}"]`).value;
    
    const dataFinal = {
      string: string,
      modalName: modalName
    };

    fetch(`/${pathAdmin}/helper/generate-slug`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dataFinal)
    })
      .then(res => res.json())
      .then(data => {
        if(data.code == "error") {
          notyf.error(data.message);
        }

        if(data.code == "success") {
          document.querySelector(`[name="${to}"]`).value = data.slug;
        }
      })
  })
}
// End btn-generate-slug

// button-api
const listButtonApi = document.querySelectorAll("[button-api]");
if(listButtonApi.length > 0) {
  listButtonApi.forEach(button => {
    button.addEventListener("click", () => {
      const method = button.getAttribute("data-method");
      const api = button.getAttribute("data-api");

      fetch(api, {
        method: method || "GET"
      })
        .then(res => res.json())
        .then(data => {
          if(data.code == "error") {
            notyf.error(data.message);
          }

          if(data.code == "success") {
            drawNotify(data.code, data.message);
            location.reload();
          }
        })
    })
  })
}
// End button-api

// form-search
const formSearch = document.querySelector("[form-search]");
if(formSearch) {
  const url = new URL(window.location.href);

  formSearch.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = event.target.keyword.value;
    if(value) {
      url.searchParams.set("keyword", value);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  })

  // Hiển thị giá trị mặc định
  const valueCurrent = url.searchParams.get("keyword");
  if(valueCurrent) {
    formSearch.keyword.value = valueCurrent;
  }
}
// End form-search

// pagination
const pagination = document.querySelector("[pagination]");
if(pagination) {
  const url = new URL(window.location.href);

  pagination.addEventListener("change", () => {
    const value = pagination.value;
    if(value) {
      url.searchParams.set("page", value);
    } else {
      url.searchParams.delete("page");
    }
    window.location.href = url.href;
  })

  // Hiển thị giá trị mặc định
  const valueCurrent = url.searchParams.get("page");
  if(valueCurrent) {
    pagination.value = valueCurrent;
  }
}
// End pagination

// button-copy
const listButtonCopy = document.querySelectorAll("[button-copy]");
if(listButtonCopy.length > 0) {
  listButtonCopy.forEach(button => {
    button.addEventListener("click", () => {
      const content = button.getAttribute("data-content");
      window.navigator.clipboard.writeText(content);
      notyf.success("Đã copy!");
    })
  })
}
// End button-copy

// Modal Preview File
const modalPreviewFile = document.querySelector("#modalPreviewFile");
if(modalPreviewFile) {
  const innerPreview = modalPreviewFile.querySelector(".inner-preview");

  // Sự kiện click button
  let buttonClicked = null;

  const listButtonPreviewFile = document.querySelectorAll("[button-preview-file]");
  listButtonPreviewFile.forEach(button => {
    button.addEventListener("click", () => {
      buttonClicked = button;
    })
  })

  // Sự kiện đóng modal
  modalPreviewFile.addEventListener('hidden.bs.modal', event => {
    buttonClicked = null;
    innerPreview.innerHTML = "";
  })

  // Sự kiện mở modal
  modalPreviewFile.addEventListener('shown.bs.modal', event => {
    const file = buttonClicked.getAttribute("data-file");
    const mimetype = buttonClicked.getAttribute("data-mimetype");

    // Nếu là file ảnh
    if(mimetype.includes("image")) {
      innerPreview.innerHTML = `
        <img src="${file}" width="100%" />
      `;
    }
    else if(mimetype.includes("audio")) {
      innerPreview.innerHTML = `
        <audio controls>
          <source src="${file}" />
        </audio>
      `;
    }
    else if(mimetype.includes("video")) {
      innerPreview.innerHTML = `
        <video controls width="100%">
          <source src="${file}" />
        </video>
      `;
    }
    else if(mimetype.includes("application/pdf")) {
      innerPreview.innerHTML = `
        <iframe src="${file}" width="100%" height="600px"></iframe>
      `;
    }
  })
}
// End Modal Preview File