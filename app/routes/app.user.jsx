import { Form } from "@remix-run/react";
import { redirect } from "@remix-run/node";

// Action to handle form submission
export async function action({ request }) {
    // Get the form data from the request
    const body = await request.formData();

    // Use the `get` method to get the value of the form field
    const newUser = {
        name: body.get("name"),
        email: body.get("email"),
        password: body.get("password"),
    };

    // You can use newUser to create a new user in your database
    console.log(newUser);

    // Redirect to the user page
    return redirect("/");
}

// Route to render the form
export default function User() {
    return (
        <>
            <Form method="post">
                <input type="text" name="name" placeholder="Name" />
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <button type="submit">Create User</button>
            </Form>
        </>
    );
}