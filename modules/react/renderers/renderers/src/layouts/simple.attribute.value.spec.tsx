import {render, screen} from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom';
import {SimpleAttributeValueLayout} from "./simple.attribute.value.layout";

describe("SimpleAttributeValueLayout", () => {
    it("renders exactly two children passed to it", () => {
        render(
            <SimpleAttributeValueLayout>
                <span>Child One</span>
                <span>Child Two</span>
            </SimpleAttributeValueLayout>
        );

        expect(screen.getByText("Child One")).toBeInTheDocument();
        expect(screen.getByText("Child Two")).toBeInTheDocument();
    });

});
