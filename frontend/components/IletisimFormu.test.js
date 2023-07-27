import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";
import { wait } from "@testing-library/user-event/dist/utils";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
  const formBaslik = screen.getByRole("heading", { level: 1 });
  expect(formBaslik).toBeInTheDocument();
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  const formBaslik = screen.getByRole("heading", { level: 1 });
  expect(formBaslik).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");

  userEvent.type(ad, "abc");

  await waitFor(() => {
    expect(
      screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
    ).toBeInTheDocument();
  });

  const errorsArr = await screen.findAllByTestId("error");
  expect(errorsArr).toHaveLength(1);
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const sbtn = screen.getByText("Gönder");

  userEvent.click(sbtn);

  await waitFor(() => {
    expect(
      screen.getByText("Hata: ad en az 5 karakter olmalıdır.")
    ).toBeInTheDocument();

    expect(screen.getByText("Hata: soyad gereklidir.")).toBeInTheDocument();

    expect(
      screen.getByText("Hata: email geçerli bir email adresi olmalıdır.")
    ).toBeInTheDocument();
  });

  const errorsArr = await screen.findAllByTestId("error");
  expect(errorsArr).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const sbtn = screen.getByText("Gönder");

  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.click(sbtn);

  //await findByText("Hata: email geçerli bir email adresi olmalıdır.")

  await waitFor(() => {
    expect(
      screen.getByText("Hata: email geçerli bir email adresi olmalıdır.")
    ).toBeInTheDocument();
  });

  const errorsArr = await screen.findAllByTestId("error");
  expect(errorsArr).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const email = screen.getByLabelText("Email*");
  //const sbtn = screen.getByText("Gönder");

  userEvent.type(email, "gecersizemail");
  //userEvent.click(sbtn);

  await waitFor(() => {
    expect(
      screen.queryByText("Hata: email geçerli bir email adresi olmalıdır.")
    ).toBeInTheDocument();
  });
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  const email = screen.getByLabelText("Email*");
  const sbtn = screen.getByText("Gönder");

  userEvent.type(ad, "İlhan");
  userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");
  userEvent.click(sbtn);

  await waitFor(() => {
    expect(screen.queryByText("Hata: soyad gereklidir.")).toBeInTheDocument();
  });
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const email = screen.getByLabelText("Email*");
  const sbtn = screen.getByText("Gönder");

  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");
  userEvent.click(sbtn);

  await waitFor(() => {
    expect(
      screen.queryByText("Hata: Mesaj gereklidir.")
    ).not.toBeInTheDocument();
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const ad = screen.getByLabelText("Ad*");
  const soyad = screen.getByLabelText("Soyad*");
  const email = screen.getByLabelText("Email*");
  const mesaj = screen.getByLabelText("Mesaj");
  const sbtn = screen.getByText("Gönder");

  userEvent.type(ad, "İlhan");
  userEvent.type(soyad, "Mansız");
  userEvent.type(email, "yüzyılıngolcüsü@hotmail.com");
  userEvent.type(mesaj, "Bu bir test mesajıdır.");
  userEvent.click(sbtn);

  await waitFor(() => {
    expect(screen.queryByTestId("firstnameDisplay")).toHaveTextContent(
      "Ad: İlhan"
    );
    expect(screen.queryByTestId("lastnameDisplay")).toHaveTextContent(
      "Soyad: Mansız"
    );
    expect(screen.queryByTestId("emailDisplay")).toHaveTextContent(
      "Email: yüzyılıngolcüsü@hotmail.com"
    );
    expect(screen.queryByTestId("messageDisplay")).toHaveTextContent(
      "Mesaj: Bu bir test mesajıdır."
    );
  });
});
