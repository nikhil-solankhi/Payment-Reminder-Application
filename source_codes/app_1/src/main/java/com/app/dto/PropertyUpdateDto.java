package com.app.dto;

import com.app.pojos.Address;
import com.app.pojos.BaseEntity;

public class PropertyUpdateDto extends BaseEntity{
	
	private String name;

	private Address address;

	private Long ownerId;

	public PropertyUpdateDto() {
		// TODO Auto-generated constructor stub
	}

	public PropertyUpdateDto(String name, Address address, Long ownerId) {
		super();
		this.name = name;
		this.address = address;
		this.ownerId = ownerId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public Long getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(Long ownerId) {
		this.ownerId = ownerId;
	}

	@Override
	public String toString() {
		return "PropertyUpdateDto [name=" + name + ", address=" + address + ", ownerId=" + ownerId + ", getId()="
				+ getId() + "]";
	}

	
}
