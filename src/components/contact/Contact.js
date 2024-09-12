import React, { useState } from "react";
import Title from "../layouts/Title";
import ContactLeft from "./ContactLeft";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required!";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required!";
    if (!formData.email.trim()) newErrors.email = "Email is required!";
    else if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address!";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required!";
    if (!formData.message.trim()) newErrors.message = "Message is required!";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (validateForm()) {
      emailjs
        .send(
          process.env.REACT_APP_EMAILJS_SERVICE_ID,
          process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
          {
            ...formData,
            to_name: process.env.REACT_APP_RECIPIENT_NAME,
            to_email: process.env.REACT_APP_RECIPIENT_EMAIL,
          },
          process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            setSuccessMsg(
              `Thank you dear ${formData.username}, Your message has been sent successfully!`
            );
            setFormData({
              username: "",
              phoneNumber: "",
              email: "",
              subject: "",
              message: "",
            });
            setErrors({});
          },
          (error) => {
            console.log("FAILED...", error);
            console.error("Error details:", error);
            setSuccessMsg("Failed to send message. Please try again later.");
          }
        );
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-20 border-b-[1px] border-b-black"
    >
      <div className="flex justify-center items-center text-center">
        <Title title="CONTACT" des="Contact With Me" />
      </div>
      <div className="w-full">
        <div className="w-full h-auto flex flex-col lgl:flex-row justify-between">
          <ContactLeft />
          <div className="w-full lgl:w-[60%] h-full py-10 bg-gradient-to-r from-[#1e2024] to-[#23272b] flex flex-col gap-8 p-4 lgl:p-8 rounded-lg shadow-shadowOne">
            <form className="w-full flex flex-col gap-4 lgl:gap-6 py-2 lgl:py-5">
              {successMsg && (
                <p className="py-3 bg-gradient-to-r from-[#1e2024] to-[#23272b] shadow-shadowOne text-center text-green-500 text-base tracking-wide animate-bounce">
                  {successMsg}
                </p>
              )}
              <div className="w-full flex flex-col lgl:flex-row gap-10">
                <div className="w-full lgl:w-1/2 flex flex-col gap-4">
                  <p className="text-sm text-gray-400 uppercase tracking-wide">
                    Your name
                  </p>
                  <input
                    name="username"
                    onChange={handleChange}
                    value={formData.username}
                    className={`${
                      errors.username && "outline-designColor"
                    } contactInput`}
                    type="text"
                  />
                  {errors.username && (
                    <p className="text-red-500 text-sm">{errors.username}</p>
                  )}
                </div>
                <div className="w-full lgl:w-1/2 flex flex-col gap-4">
                  <p className="text-sm text-gray-400 uppercase tracking-wide">
                    Phone Number
                  </p>
                  <input
                    name="phoneNumber"
                    onChange={handleChange}
                    value={formData.phoneNumber}
                    className={`${
                      errors.phoneNumber && "outline-designColor"
                    } contactInput`}
                    type="text"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <input
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  className={`${
                    errors.email && "outline-designColor"
                  } contactInput`}
                  type="email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  Subject
                </p>
                <input
                  name="subject"
                  onChange={handleChange}
                  value={formData.subject}
                  className={`${
                    errors.subject && "outline-designColor"
                  } contactInput`}
                  type="text"
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm">{errors.subject}</p>
                )}
              </div>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-400 uppercase tracking-wide">
                  Message
                </p>
                <textarea
                  name="message"
                  onChange={handleChange}
                  value={formData.message}
                  className={`${
                    errors.message && "outline-designColor"
                  } contactTextArea`}
                  cols="30"
                  rows="8"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm">{errors.message}</p>
                )}
              </div>
              <div className="w-full">
                <button
                  onClick={handleSend}
                  className="w-full h-12 bg-[#141518] rounded-lg text-base text-gray-400 tracking-wider uppercase hover:text-white duration-300 hover:border-[1px] hover:border-designColor border-transparent"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
