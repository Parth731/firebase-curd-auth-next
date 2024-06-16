"use client";
import MyFirebaseContext from "@/context/MyFirebaseContext";
import { useFormik } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import * as Yup from "yup";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { singleBookType } from "@/types/types";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/context";
import { IMAGE_PATH } from "@/constant/constant";

const ListingPage = () => {
  const firebase = MyFirebaseContext();

  // const [name, setName] = useState<string>("");
  // const [isbnNumber, setIsbnNumber] = useState<string>("");
  // const [price, setPrice] = useState<string>("");
  const params = useSearchParams();
  const uid: string | null = params.get("uid");
  const isEdit: boolean | null = Boolean(params.get("edit"));
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const router = useRouter();
  const [url, seturl] = useState<string>("");
  const [loading, setloading] = useState<boolean>(false);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookData, setBookData] = useState<any>({});
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [perc, setPerc] = useState<any>(null);

  console.log(bookFile);
  console.log(bookData);

  // console.log(name, isbnNumber, price, coverPic);

  useEffect(() => {
    const uploadFile = () => {
      // const name = new Date().getTime() + file?.name!;

      // console.log(name);
      const storageRef = ref(
        storage,
        `${IMAGE_PATH}${Date.now()}-${bookFile?.name!}`
      );

      console.log(storageRef);

      const uploadTask = uploadBytesResumable(storageRef, bookFile!);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setLoadingProgress(progress);
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setBookData((prev: any) => ({ ...prev, imageURL: downloadURL }));
            console.log(downloadURL);
            toast.success("file upload successfully!!");
            // setImageURL(downloadURL);
          });
        }
      );
    };
    bookFile && uploadFile();
  }, [bookFile]);

  useEffect(() => {
    // firebase
    //   .getBookById(params.bookId as string)
    //   .then((value: any) => setData(value.data()));

    const fetchData = async () => {
      setloading(true);
      try {
        const bookItem = await firebase.getBookById(uid as string);
        console.log(bookItem.data());
        setBookData(bookItem.data());
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setloading(false);
      }
    };

    if (uid && isEdit) {
      fetchData();
    }
  }, [isEdit]);

  // useEffect(() => {
  //   if (isEdit) {
  //     const imageURL = data?.imageURL;
  //     firebase.getImageURL(imageURL).then((url: any) => seturl(url));
  //   }
  // }, [data, isEdit]);

  const initialValues: {
    bookName: string;
    price: number;
    isbn: number;
    fileUpload?: File | null;
  } =
    uid && isEdit && bookData
      ? {
          bookName: bookData?.name!,
          price: bookData?.price!,
          isbn: bookData?.isbn!,
        }
      : {
          bookName: "",
          price: 0,
          isbn: 0,
          fileUpload: null,
        };

  const validationSchema = isEdit
    ? Yup.object().shape({
        bookName: Yup.string().required("Book name is required"),
        price: Yup.number().required("Price is required"),
        // .positive("Price must be a positive number"),
        isbn: Yup.number().required("ISBN is required"),
      })
    : Yup.object().shape({
        bookName: Yup.string().required("Book name is required"),
        price: Yup.number().required("Price is required"),
        // .positive("Price must be a positive number"),
        isbn: Yup.number().required("ISBN is required"),

        fileUpload: Yup.mixed()
          .required("File is required")
          .test(
            "fileSize",
            "File too large",
            (value: any) => value && value?.size <= 1024 * 1024 // 1 MB
          )
          .test(
            "fileFormat",
            "Unsupported Format",
            (value: any) =>
              value && ["image/jpeg", "image/png"].includes(value?.type)
          ),
      });

  const handleBookSubmit = async (values: any) => {
    console.log(values);
    try {
      if (!isEdit && !uid) {
        const bookRef = await firebase.handleCreateNewListingBySetDoc(
          values,
          bookData?.imageURL
        );
        toast.success("Book info created successfully !!!");
        formik.resetForm();

        router.push("/");
      } else {
        const bookRef = await firebase.updateBooks(
          values,
          uid,
          bookData?.imageURL
        );
        toast.success("Book info update successfully !!!");
        formik.resetForm();
        router.push("/");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
    try {
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleBookSubmit,

    enableReinitialize: true,
  });

  const {
    setFieldValue,
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    handleChange,
  } = formik;

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   try {
  //     await firebase.handleCreateNewListing(name, isbnNumber, price, coverPic);
  //   } catch (error: any) {
  //     console.log(error);
  //     toast.error(error.message);
  //   }
  // };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="col-6">
        <h2 className="text-center mb-4">
          {isEdit ? "Update Book" : "Book Form"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="bookName">Book Name</label>
            <input
              name="bookName"
              type="text"
              className="form-control"
              placeholder="Enter Book Name"
              value={values.bookName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.bookName && touched.bookName ? (
              <div className="text-danger">{errors.bookName}</div>
            ) : null}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="price">Price</label>
            <input
              name="price"
              type="number"
              className="form-control"
              placeholder="Enter Price"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
            />
            {errors.price && touched.price ? (
              <div className="text-danger">{errors.price}</div>
            ) : null}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="isbn">ISBN</label>
            <input
              name="isbn"
              type="number"
              className="form-control"
              placeholder="Enter ISBN"
              value={values.isbn}
              onChange={handleChange}
              onBlur={handleBlur}
              min={0}
            />
            {errors.isbn && touched.isbn ? (
              <div className="text-danger">{errors.isbn}</div>
            ) : null}
          </div>
          <div className="form-group mb-3">
            <label htmlFor="fileUpload">
              File Upload <DriveFolderUploadOutlinedIcon className="icon" />
            </label>
            <input
              name="fileUpload"
              type="file"
              className="form-control"
              placeholder="Enter File Upload"
              // onBlur={handleBlur}
              // onChange={(e) => setCoverPic(e.target.files[0])}
              // onChange={(event: any) => setCoverPic(event.currentTarget.files[0])}
              onChange={(event: any) => {
                setBookFile(event.target.files[0]);
                setFieldValue("fileUpload", event.target.files[0]);
              }}
            />
            {errors.fileUpload && touched.fileUpload ? (
              <div className="text-danger">{errors.fileUpload}</div>
            ) : null}
          </div>
          <div>
            <img
              src={
                // firebase.file
                //   ? URL.createObjectURL(firebase.file)
                //   : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"

                bookFile
                  ? URL.createObjectURL(bookFile)
                  : isEdit
                  ? `${bookData?.imageURL}`
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
              className="mt-2 mb-2"
              style={{ width: "200px", height: "200px" }}
            />

            <h3>
              {`${
                loadingProgress !== 100.0
                  ? "Loading..." + loadingProgress?.toFixed(2)
                  : loadingProgress?.toFixed(2)
              }`}
              %
            </h3>
          </div>
          <button
            type="submit"
            disabled={
              !isEdit && loadingProgress !== null && loadingProgress < 100
            }
            className="btn btn-primary w-100"
          >
            {isEdit ? "Update" : "Submit"}
          </button>
          {/* <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter Book Name</Form.Label>
          <Form.Control
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Book name"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>ISBN</Form.Label>
          <Form.Control
            onChange={(e) => setIsbnNumber(e.target.value)}
            value={isbnNumber}
            type="text"
            placeholder="ISBN Number"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Price</Form.Label>
          <Form.Control
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            type="text"
            placeholder="Enter Price"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Cover Pic</Form.Label>
          <Form.Control
            onChange={(e: any) => {
              console.log(e.target.files);
              setCoverPic(e.target.files[0] as any);
            }}
            type="file"
          />
        </Form.Group> */}
          {/* 
          <Button variant="primary" type="submit">
            Create
          </Button> */}
        </form>
      </div>
    </div>
  );
};

export default ListingPage;
